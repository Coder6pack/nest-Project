import { SetMetadata } from '@nestjs/common'
import { AuthType, ConditionGuardType } from '../constants/auth.constant'
export const AUTH_TYPE_KEY = 'authType'

export type AuthTypeDecoratorType = {
	authTypes: AuthType[]
	options: { condition: ConditionGuardType }
}
export const Auth = (authTypes: AuthType[], options: { condition: ConditionGuardType }) => {
	return SetMetadata(AUTH_TYPE_KEY, { authTypes, options })
}
