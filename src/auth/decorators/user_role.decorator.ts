import { SetMetadata } from "@nestjs/common";
import { UserType } from "../../uitils/enums.js";



export const Roles=(...roles:UserType[])=>SetMetadata('roles',roles);