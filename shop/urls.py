from django.urls import path,include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register("categori",CategoryView,basename="CategoryView")
router.register("cart",Mycart,basename="cart")
router.register("orders",OldOrders,basename="orders")

urlpatterns = [
     path("",include(router.urls)),
     path('product/',ProductView.as_view(),name="product"),
     path('product/<int:id>/',ProductView.as_view(),name="product"),
     path('profile/',ProfileView.as_view(),name="profile"),
     path('userdataupdate/',UserDataUpdate.as_view(),name="userdataupdate"),
     path('profileimageupdate/',ProfileImageUpdate.as_view(),name="profileimageupdate"),
     path('addtocart/',Addtocart.as_view(),name="addtocart"),
     path('updatecart/',Updatecart.as_view(),name="updatecart"),
     path('editcart/',Editcart.as_view(),name="editcart"),
     path('deletecartproduct/',Deletecartproduct.as_view(),name="deletecartproduct"),
     path('deletefullcart/',Deletefullcart.as_view(),name="deletefullcart"),
     path('register/',RegisterView.as_view(),name="register"),
]
