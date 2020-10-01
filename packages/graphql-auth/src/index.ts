// TODO: see if there is a interesting way to add logging

type RoleOrConfig =
  | string
  | {
      test: any;
      skip: any;
      role: (role: string) => boolean;
    };

type AuthorizationCheck = (roleOrConfig: RoleOrConfig) => Function;

type CreateAuthorization = ({
  hasPermission,
}: {
  hasPermission: (roleOrConfig: RoleOrConfig, user: any) => boolean;
}) => Function;

export const createAuthorization: CreateAuthorization = ({ hasPermission }) => {
  const authorization: AuthorizationCheck = (roleOrConfig) => (
    callback: Function
  ) => {
    return async (root: any, params: any, context: any, info: any) => {
      if (typeof roleOrConfig === 'string') {
        if (!hasPermission(roleOrConfig, context.user)) {
          throw new Error(`This user does not have the ${roleOrConfig} role`);
        }
      }

      if (typeof roleOrConfig === 'object') {
        const { test, role, skip } = roleOrConfig;

        if (typeof test === 'function') {
          const passedTest = test(root, params, context, info);

          if (!passedTest) {
            throw new Error('This user does not pass the authoerization test');
          }
        }

        if (typeof skip === 'function') {
          const didSkip = skip(root, params, context, info);

          if (!didSkip) {
            throw new Error('This user does not skip the authorization check');
          }
        }

        if (typeof role === 'string') {
          if (!hasPermission(role, context.user)) {
            throw new Error(`This user does not have the ${roleOrConfig} role`);
          }
        }
      }

      if (typeof callback === 'function') {
        return callback(root, params, context, info);
      }
    };
  };

  return authorization;
};
