from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class getRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code = code)
            if len(room)>0:
                data = self.serializer_class(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status = status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request":"Code Params Not Found"}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        # check if the user session already exists
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        #for post request we caan just use request.data    
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            quary_set = Room.objects.filter(code=code)
            if len(quary_set)>0:
                #room = quary_set[0]
                self.request.session['room-code'] = code
                return Response({"Message":"Room Joined"}, status=status.HTTP_200_OK)
            
            return Response({"Bad Request":"Invalid "}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"Bad Request":"Cannot Find Room Joined"}, status=status.HTTP_400_BAD_REQUEST)


#API View lets us override the methods like get and post
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    def post(self, request, format=None):
        # check if the user session already exists
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        #give the request daata to the serializer   
        serializer = self.serializer_class(data=request.data)
        #check if the data is valid
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room-code'] = room.code
            else:
                room = Room(host= host, guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
                room.save()
                self.request.session['room-code'] = room.code

            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)  
        return Response({"Bad Request":"Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data={
            'code': self.request.session.get('room-code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room-code' in self.request.session:
            self.request.session.pop('room-code')
            host_id  = self.request.session.session_key
            queryset = Room.objects.filter(host=host_id)
            if len(queryset)>0:
                room = queryset[0]
                room.delete()
        return Response({"Message": "User Successfully removed from the room"}, status=status.HTTP_200_OK)  

class UpdateRoomView(APIView):
    serializer_class = UpdateRoomSerializer
    # patch methodd is use when you aare just upaating something
    def patch(self, request, format = None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)
            if len(queryset)>0:
                room = queryset[0]
                host_id = self.request.session.session_key
                if room.host != host_id:
                    return Response({"Err":"You cannot change the room"}, status=status.HTTP_403_FORBIDDEN)
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            
            return Response({"Err":"Cannot Find the room"}, status=status.HTTP_404_NOT_FOUND)


        return Response({"Bad Request":"Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
