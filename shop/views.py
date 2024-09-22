from rest_framework.response import Response
from rest_framework import generics,mixins,viewsets,views
from .models import *
from .serializers import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


class ProductView(generics.GenericAPIView,mixins.ListModelMixin,mixins.RetrieveModelMixin):
    queryset = Product.objects.all().order_by("-id")
    serializer_class=ProductsSerializer
    lookup_field = "id"

    def get(self,request,id=None):
        if id:
            return self.retrieve(request)
        else:
            return self.list(request)
        
class CategoryView(viewsets.ViewSet):
    def list(self,request):
        query = Category.objects.all().order_by("-id")
        serializers = CategorySerializer(query,many=True)
        return Response(serializers.data)
    
    def retrieve(self,request,pk=None):
        query = Category.objects.get(id=pk)
        serializers = CategorySerializer(query)
        serializers_data = serializers.data
        all_data = []
        category_products = Product.objects.filter(category_id=serializers_data['id'])
        category_products_serilazer = ProductsSerializer(category_products,many=True)
        serializers_data['category_products'] = category_products_serilazer.data
        all_data.append(serializers_data)
        return Response(all_data)
    
class ProfileView(views.APIView):
    authentication_classes = [TokenAuthentication,]
    permission_classes = [IsAuthenticated,]
    def get(self,request):
        try:
            query = Profile.objects.get(prouser=request.user)
            serializers = ProfileSerializer(query)
            response_msg = {"error":False,"data":serializers.data}
        except:
            response_msg = {'error':True, "message":"Something went wrong"}
        return Response(response_msg)
    
class UserDataUpdate(views.APIView):
    authentication_classes=[TokenAuthentication, ]
    permission_classes=[IsAuthenticated, ]
    def post(self,request):
        try:
            user = request.user
            data = request.data
            user_obj = User.objects.get(username=user)
            user_obj.first_name = data["first_name"]
            user_obj.last_name = data["last_name"]
            user_obj.email = data["email"]
            user_obj.save()
            response_msg = {"error":False,"message":"User Data is Updated"}
        except:
            response_data = {"error":True,"message":"User Data is not Updated!"}
        return Response(response_msg)
    
class ProfileImageUpdate(views.APIView):
    authentication_classes=[TokenAuthentication, ]
    permission_classes=[IsAuthenticated, ]

    def post(self,request):
        try:
            user = request.user
            query = Profile.objects.get(prouser=user)
            data = request.data
            serializers = ProfileSerializer(query,data=data,context={"request":request})
            serializers.is_valid(raise_exception=True)
            serializers.save()
            return_res = {"message":"Profile Image is Updated"}
        except:
            return_res = {"message":"Something Went Wrong!"}
        return Response(return_res)
    

class Mycart(viewsets.ViewSet):
    authentication_classes=[TokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    
    def list(self,request):
        query = Cart.objects.filter(customer=request.user.profile)
        serializers = Cartserializer(query,many=True)
        all_data = []
        for cart in serializers.data:
            cart_product = CartProduct.objects.filter(cart=cart['id'])
            cart_product_serializer = CartProductserializer(cart_product,many=True)
            cart["cartproduct"] = cart_product_serializer.data
            all_data.append(cart)
        return Response(all_data)
    

class OldOrders(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, ]
    authentication_classes=[TokenAuthentication, ]
    def list(self,request):
        query = Order.objects.filter(cart__customer=request.user.profile)
        serializers = OrderSerializer(query,many=True)
        all_data = []
        for order in serializers.data:
            cart_product = CartProduct.objects.filter(cart_id = order['cart']['id'])
            cart_product_serializer = CartProductserializer(cart_product,many=True)
            order['cartproduct'] = cart_product_serializer.data
            all_data.append(order)
        return Response(all_data)
    
    def retrieve(self,request,pk=None):
        try:
            query = Order.objects.get(id=pk)
            serializers = OrderSerializer(query)
            data = serializers.data
            all_data = []
            cartproduct = CartProduct.objects.filter(cart_id=data['cart']["id"])
            cartproduct_serializer = CartProductserializer(cartproduct,many=True)
            data["cartproduct"] = cartproduct_serializer.data
            all_data.append(data)
            response_msg = {'error':False, "data":all_data}
        except:
            response_msg = {'error':True, "message":"No Data for this is"}
        return Response(response_msg)
    
    def create(self,request):
        try:
            data = request.data
            cart_id = data['cartid']
            address = data['address']
            email = data['email']
            mobile = data['mobile']
            cart_obj = Cart.objects.get(id=cart_id)
            cart_obj.complit = True
            cart_obj.save()
            Order.objects.create(
                cart = cart_obj,
                address = address,
                mobile = mobile,
                email = email,
                total = cart_obj.total,
                discount = 3
            )
            response_msg = {'error':False, "message":"Your Order Complete"}
        except:
            response_msg = {'error':True, "message":"Something Went Wrong"}
        return Response(response_msg)
    
    def destroy(self,request,pk=None):
        try:
            order_obj = Order.objects.get(id=pk)
            cart_obj = Cart.objects.get(id=order_obj.cart.id)
            order_obj.delete()
            cart_obj.delete()
            response_msg = {'error':False, "message":"Order Deleted"}
        except:
            response_msg = {'error':True, "message":"Something Went Wrong"}
        return Response(response_msg)


class Addtocart(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes=[TokenAuthentication, ]
    def post(self,request):
        product_id = request.data['id']
        product_obj = Product.objects.get(id=product_id)
        # print(product_obj,"product_obj")        
        cart_cart = Cart.objects.filter(customer=request.user.profile).filter(complit=False).first()
        cart_product_obj = CartProduct.objects.filter(product__id=product_id).first()
        
        try:
            if cart_cart:
                # print(cart_cart)
                # print("OLD CART")
                this_product_in_cart = cart_cart.cartproduct_set.filter(product=product_obj)
                if this_product_in_cart.exists():
                    # print("OLD CART PRODUCT--OLD CART")
                    cartprod_uct = CartProduct.objects.filter(product=product_obj).filter(cart__complit=False).first()
                    cartprod_uct.quantity +=1
                    cartprod_uct.subtotal +=product_obj.selling_price
                    cartprod_uct.save()
                    cart_cart.total +=product_obj.selling_price
                    cart_cart.save()
                else:
                    # print("NEW CART PRODUCT CREATED--OLD CART")
                    cart_product_new=CartProduct.objects.create(
                        cart = cart_cart,
                        price  =product_obj.selling_price,
                        quantity = 1,
                        subtotal = product_obj.selling_price
                    )
                    cart_product_new.product.add(product_obj)
                    cart_cart.total +=product_obj.selling_price
                    cart_cart.save()
            else:
                # print(cart_cart)
                # print("NEW CART CREATED")
                Cart.objects.create(customer=request.user.profile,total=0,complit=False)
                new_cart = Cart.objects.filter(customer=request.user.profile).filter(complit=False).first()
                cart_product_new=CartProduct.objects.create(
                        cart = new_cart,
                        price  =product_obj.selling_price,
                        quantity = 1,
                        subtotal = product_obj.selling_price
                    )
                cart_product_new.product.add(product_obj)
                # print("NEW CART PRODUCT CREATED")    
                new_cart.total +=product_obj.selling_price
                new_cart.save()

            response_mesage = {'error':False,'message':"Product add to card successfully","productid":product_id}
        
        except:
            response_mesage = {'error':True,'message':"Product Not add!Somthing is Wromg"}

        return Response(response_mesage)
    

class Updatecart(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes=[TokenAuthentication, ]
    def post(self,request):
        cart_product_id = request.data["id"]
        cart_product = CartProduct.objects.get(id=cart_product_id)
        cart_obj = cart_product.cart

        cart_product.quantity += 1
        cart_product.subtotal += cart_product.price
        cart_product.save()

        cart_obj.total += cart_product.price
        cart_obj.save()

        return Response({"message":"CartProduct is Added"})

class Editcart(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes=[TokenAuthentication, ]
    def post(self,request):
        cart_product_id = request.data["id"]
        cart_product = CartProduct.objects.get(id=cart_product_id)
        cart_obj = cart_product.cart

        cart_product.quantity -= 1
        cart_product.subtotal -= cart_product.price
        cart_product.save()

        cart_obj.total -= cart_product.price
        cart_obj.save()
        if(cart_product.quantity==0):
            cart_product.delete()

        return Response({"message":"CartProduct is Edited"})
    
class Deletecartproduct(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes=[TokenAuthentication, ]
    def post(self,request):
        cart_product = CartProduct.objects.get(id=request.data['id'])
        cart_product.delete()
        return Response({"message":"CartProduct is Deleted"})
    
class Deletefullcart(views.APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes=[TokenAuthentication, ]
    def post(self,request):
        try:
            cart_id = request.data["id"]
            cart_obj = Cart.objects.get(id=cart_id)
            cart_obj.delete()
            response_msg = {"error":False,"message":"Cart is Deleted"}
        except:
            response_msg = {"error":True,"message":"Cart is not Deleted"}
        return Response(response_msg)
    
class RegisterView(views.APIView):
    def post(self,request):
        serializers = Userserializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response({'error':False,'message':f"User is created for '{serializers.data['username']}'"})
        return Response({"error":True,"message":"Something went Wrong"})