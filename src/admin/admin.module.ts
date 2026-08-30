import { AdminModule as NestAdminModule } from '@adminjs/nestjs';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { Module } from '@nestjs/common';
import AdminJS from 'adminjs';
import bcrypt from 'bcryptjs';
import { AuthModule } from '../auth/auth.module.js';
import { AuthService } from '../auth/auth.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

// Register Prisma adapter for AdminJS
AdminJS.registerAdapter({ Database, Resource });

/**
 * Helper to prepare Prisma 7 models for AdminJS
 * In Prisma 7, field metadata is streamlined, so we explicitly attach
 * isId and isRequired to make all CRUD operations (Create, Read, Update, Delete) work seamlessly.
 */
export function getPrismaModel(modelName: string) {
  const rawModel = getModelByName(modelName);
  if (!rawModel) return null;
  return {
    ...rawModel,
    fields: rawModel.fields.map((f: any) => ({
      ...f,
      isId: f.isId ?? f.name === 'id',
      isRequired:
        f.isRequired ?? (f.name !== 'createdAt' && f.name !== 'updatedAt'),
    })),
  };
}

@Module({
  imports: [
    NestAdminModule.createAdminAsync({
      imports: [PrismaModule, AuthModule],
      inject: [PrismaService, AuthService],
      useFactory: async (prisma: PrismaService, authService: AuthService) => {
        const secret =
          process.env.JWT_SECRET ||
          'super-secret-adminjs-cookie-password-32chars';

        return {
          adminJsOptions: {
            rootPath: '/admin',
            branding: {
              companyName: 'Mahasiswa Admin Portal',
              softwareBrothers: false,
            },
            resources: [
              {
                resource: {
                  model: getPrismaModel('Mahasiswa'),
                  client: prisma,
                },
                options: {
                  navigation: { name: 'Akademik', icon: 'UserCheck' },
                  properties: {
                    id: {
                      isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false,
                      },
                    },
                    nim: { isTitle: true },
                    angkatan: { type: 'number' },
                    createdAt: {
                      isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false,
                      },
                    },
                    updatedAt: {
                      isVisible: {
                        list: false,
                        filter: false,
                        show: true,
                        edit: false,
                      },
                    },
                  },
                },
              },
              {
                resource: {
                  model: getPrismaModel('User'),
                  client: prisma,
                },
                options: {
                  navigation: { name: 'Sistem', icon: 'Settings' },
                  properties: {
                    id: {
                      isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false,
                      },
                    },
                    username: { isTitle: true },
                    password: {
                      type: 'password',
                      isVisible: {
                        list: false,
                        filter: false,
                        show: false,
                        edit: true,
                      },
                    },
                    role: {
                      availableValues: [
                        { value: 'admin', label: 'Admin' },
                        { value: 'user', label: 'User' },
                      ],
                    },
                    createdAt: {
                      isVisible: {
                        list: true,
                        filter: true,
                        show: true,
                        edit: false,
                      },
                    },
                    updatedAt: {
                      isVisible: {
                        list: false,
                        filter: false,
                        show: true,
                        edit: false,
                      },
                    },
                  },
                  actions: {
                    new: {
                      before: async (request: any) => {
                        if (request.payload?.password) {
                          request.payload.password = await bcrypt.hash(
                            request.payload.password,
                            10,
                          );
                        }
                        return request;
                      },
                    },
                    edit: {
                      before: async (request: any) => {
                        if (
                          request.payload?.password &&
                          request.payload.password.trim() !== ''
                        ) {
                          request.payload.password = await bcrypt.hash(
                            request.payload.password,
                            10,
                          );
                        } else if (request.payload) {
                          delete request.payload.password;
                        }
                        return request;
                      },
                    },
                  },
                },
              },
            ],
          },
          auth: {
            authenticate: async (email, password) => {
              const user = await authService.validateUser(email, password);
              if (user) {
                return {
                  email: user.username,
                  title: user.nama,
                  role: user.role,
                };
              }
              return null;
            },
            cookiePassword: secret,
            cookieName: 'adminjs_session',
          },
          sessionOptions: {
            resave: false,
            saveUninitialized: false,
            secret: secret,
          },
        };
      },
    }),
  ],
  exports: [NestAdminModule],
})
export class AppAdminModule {}
