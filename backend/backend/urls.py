"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from scraper.views import QuoteList,QuoteDetail
from account.views import SignUpView,UserProfileView,SignInView,SignOutView,ForgotPasswordView,ResetPasswordView
from rest_framework_simplejwt.views import TokenObtainPairView,  TokenRefreshView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('quotes/', QuoteList.as_view()),
    path('quotes/create/', QuoteList.as_view(), name='quote-create'),
    path('quotes/update/<int:pk>/', QuoteDetail.as_view(), name='quote-update'),
    path('quotes/delete/<int:pk>/', QuoteDetail.as_view(), name='quotes-delete'),
    path('signup/', SignUpView.as_view()),
    path('signin/', SignInView.as_view(), name='signin'),
    path('signout/', SignOutView.as_view(), name='signout'),
    path('profile/', UserProfileView.as_view()),
    path('profile/update/', UserProfileView.as_view()),
    path('profile/delete/', UserProfileView.as_view()),
    path('token/', TokenObtainPairView.as_view()), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgot_password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset_password/<str:token>/', ResetPasswordView.as_view(), name='reset_password'),
    path('api/contact/', include('contact.urls')),
]
