export const REQUEST_USER_KEY = 'user'

export const AuthItem = {
	Bearer: 'Bearer',
	None: 'None',
	APIKey: 'APIKey',
} as const

export type AuthType = (typeof AuthItem)[keyof typeof AuthItem]

export const ConditionGuard = {
	And: 'and',
	Or: 'or',
} as const

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard]
