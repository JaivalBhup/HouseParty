from django.urls import path, include
from .views import RoomView, CreateRoomView, getRoom, JoinRoom, UserInRoom, LeaveRoom, UpdateRoomView
urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', getRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room', UpdateRoomView.as_view()),
]
