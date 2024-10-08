from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone_number',
            'address',
            'role',
            'admin'
        ]

    def create_user(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            role=validated_data.get('role', 'student'),
            admin=validated_data.get('admin', False)
        )

        user.set_password(validated_data['password'])
        user.save()
        return user

    def update_user(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.role = validated_data.get('role', instance.role)
        instance.admin = validated_data.get('admin', instance.admin)

        if 'password' in validated_data:
            instance.set_password(validated_data['passowrd'])

        instance.save()
        return instance
