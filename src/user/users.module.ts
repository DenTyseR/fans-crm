import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { AuthModule } from 'src/auth/auth.module';

type userDocument = HydratedDocument<User>;

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (this: userDocument) {
            if (!this.isModified('password')) {
              return;
            }
            this.password = await bcrypt.hash(this.password, 10);
            this.username = this.username.trim();
            this.name = this.name.trim();
            this.email = this.email?.trim();
            this.phone = this.phone?.trim();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
