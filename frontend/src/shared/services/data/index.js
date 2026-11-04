import { dataSourceMode } from '@/shared/services/api/config.js'
import { apiDataSource } from './apiDataSource.js'
import { mockDataSource } from './mockDataSource.js'

export const dataSource = dataSourceMode === 'api' ? apiDataSource : mockDataSource
export { apiDataSource, mockDataSource }
