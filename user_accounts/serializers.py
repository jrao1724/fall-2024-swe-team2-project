from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'phone_number',
            'address',
            'role',
            'admin',
            'password'
        )
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """
        Args:
            validated_data (_type_): Data received from request (POST)

        Returns:
            _type_: User object in JSON format
        """

        user = super(UserSerializer, self).create(validated_data)

        user.set_password(validated_data['password'])
        user.save()
        return user

    def update_user(self, instance, validated_data):
        """Updates user instance

        Args:
            instance (_type_): Instance of User model
            validated_data (_type_): Data received from request

        Returns:
            _type_: Returns the User object with updated fields in JSON format
        """
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        instance.role = validated_data.get('role', instance.role)
        instance.admin = validated_data.get('admin', instance.admin)

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        instance.save()
        return instance