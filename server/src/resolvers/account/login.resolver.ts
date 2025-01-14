import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { ServerContext } from "@server/contracts/interfaces/serverContext";
import { LoginInput } from "@server/contracts/validation/account.validator";
import { Account } from "@server/entities/account.entity";
import { AccountResponse } from "@server/shared/responses/account";

@Resolver()
export class LoginResolver {
  @Mutation(() => AccountResponse)
  async login(
    @Arg("data") { email, password }: LoginInput,
    @Ctx() { em, req }: ServerContext,
  ): Promise<AccountResponse> {
    const account = await em.findOne(Account, { email });

    if (!account) {
      return {
        errors: [
          {
            field: "emailOrPassword",
            message: "Email or password is incorrect",
          },
        ],
      };
    }

    const valid = await argon2.verify(account.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "emailOrPassword",
            message: "Email or password is incorrect",
          },
        ],
      };
    }

    req.session.accountId = account.id;

    return { account };
  }
}
