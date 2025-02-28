import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

// Chắc chắn rằng đọc file .env
config({
	path: '.env',
})

// Kiểm tra xem đã có file .env chưa
if (!fs.existsSync(path.resolve('.env'))) {
	console.log('Không tìm thấy file .env')
	process.exit(1)
}

class ConfigSchema {
	@IsString()
	DATABASE_URL: string
	@IsString()
	ACCESS_TOKEN_SECRET: string
	@IsString()
	ACCESS_TOKEN_EXPIRES_IN: string
	@IsString()
	REFRESH_TOKEN_SECRET: string
	@IsString()
	REFRESH_TOKEN_EXPIRES_IN: string
	@IsString()
	SECRET_X_API_KEY: string
}
const configServer = plainToInstance(ConfigSchema, process.env)
const errorArray = validateSync(configServer)

if (errorArray.length > 0) {
	console.log('Các giá trị khai báo trong file .env không hợp lệ')
	const errors = errorArray.map((error) => {
		return {
			property: error.property,
			constraints: error.constraints,
			value: error.value,
		}
	})
	throw errors
}

const envConfig = configServer
export default envConfig
