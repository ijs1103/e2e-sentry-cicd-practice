import { GET } from '@/app/api/movies/route'
import axios from 'axios'
import mockMovies from '@/__mocks__/movies.json'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('GET /api/movies', () => {
  const originalApiKey = process.env.OMDB_API_KEY

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    // 테스트 전에 api key 값 초기화
    delete process.env.OMDB_API_KEY
  })

  afterEach(() => {
    if (originalApiKey) {
      process.env.OMDB_API_KEY = originalApiKey
    } else {
      delete process.env.OMDB_API_KEY
    }
  })

  test('title 파라미터로 OMDB API를 호출하고 응답을 반환한다', async () => {
    const title = 'Frozen'
    const apiKey = 'test-api-key'
    process.env.OMDB_API_KEY = apiKey

    // axios.get 모킹
    mockedAxios.get.mockResolvedValue({ data: mockMovies })

    // Request 객체 생성
    const request = new Request(
      `http://localhost:3000/api/movies?title=${encodeURIComponent(title)}`
    )

    // GET 함수 호출
    const response = await GET(request)
    const responseData = await response.json()

    // 응답 데이터 확인
    expect(responseData).toEqual(mockMovies)

    // axios.get이 올바른 URL로 호출되었는지 확인
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://omdbapi.com/?apikey=${apiKey}&s=${title}`
    )
  })

  test('API_KEY가 환경변수에서 올바르게 사용된다', async () => {
    const title = 'Frozen'
    const apiKey = 'test-api-key-12345'
    process.env.OMDB_API_KEY = apiKey

    mockedAxios.get.mockResolvedValue({ data: mockMovies })

    const request = new Request(
      `http://localhost:3000/api/movies?title=${encodeURIComponent(title)}`
    )

    await GET(request)

    // axios.get이 환경변수의 api key를 사용하여 호출되었는지 확인
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining(`apikey=${apiKey}`)
    )
  })
})
