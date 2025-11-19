import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMovies, useMoviesStore, getInitialState } from '@/hooks/movies'
import mockMovies from '@/__mocks__/movies.json'
import axios from 'axios'

// axios 모킹
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// QueryClient Provider 래퍼
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 기본적으로 지수 백오프로 3회를 재시도하므로, 테스트를 위해 비활성화
        retryDelay: 0
      }
    }
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useMoviesStore', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    // 각 테스트 전에 스토어 초기화
    act(() => {
      useMoviesStore.setState(getInitialState())
    })
  })

  test('setInputText가 inputText를 업데이트한다', () => {
    const { result } = renderHook(() => useMoviesStore())

    expect(result.current.inputText).toBe('')

    act(() => {
      result.current.setInputText('Frozen')
    })

    expect(result.current.inputText).toBe('Frozen')
  })

  test('setSearchText가 searchText를 업데이트한다', () => {
    const { result } = renderHook(() => useMoviesStore())

    expect(result.current.searchText).toBe('')

    act(() => {
      result.current.setSearchText('Frozen')
    })

    expect(result.current.searchText).toBe('Frozen')
  })

  test('setMessage가 message를 업데이트한다', () => {
    const { result } = renderHook(() => useMoviesStore())

    expect(result.current.message).toBe('Search for the movie title!')

    act(() => {
      result.current.setMessage('Movie not found!')
    })

    expect(result.current.message).toBe('Movie not found!')
  })

  test('resetMovies가 모든 상태를 초기화한다', () => {
    const { result } = renderHook(() => useMoviesStore())

    // 상태 변경
    act(() => {
      result.current.setInputText('Frozen')
      result.current.setSearchText('Frozen')
      result.current.setMessage('Error message')
    })

    // 초기화
    act(() => {
      result.current.resetMovies()
    })

    expect(result.current.inputText).toBe('')
    expect(result.current.searchText).toBe('')
    expect(result.current.message).toBe('Search for the movie title!')
  })
})

describe('useMovies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    act(() => {
      useMoviesStore.setState(getInitialState())
    })
  })

  test('searchText가 비어있을 때 빈 배열을 반환한다', async () => {
    act(() => {
      useMoviesStore.setState({ searchText: '' })
    })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(mockedAxios.get).not.toHaveBeenCalled()
  })

  test('searchText가 있을 때 API를 호출하고 영화 목록을 반환한다', async () => {
    const searchText = 'Frozen'
    act(() => {
      useMoviesStore.setState({ searchText })
    })

    mockedAxios.get.mockResolvedValue({ data: mockMovies })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/api/movies?title=${searchText}`
    )
    expect(result.current.data).toEqual(mockMovies.Search)
  })

  test('API가 False Response를 반환할 때 에러를 던진다', async () => {
    const searchText = 'InvalidMovie'
    const errorMessage = 'Movie not found!'
    act(() => {
      useMoviesStore.setState({ searchText })
    })

    mockedAxios.get.mockResolvedValue({
      data: {
        Response: 'False',
        Error: errorMessage
      }
    })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe(errorMessage)
    expect(useMoviesStore.getState().message).toBe(errorMessage)
  })

  test('공백만 있는 searchText는 빈 배열을 반환한다', async () => {
    act(() => {
      useMoviesStore.setState({ searchText: '   ' })
    })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(mockedAxios.get).not.toHaveBeenCalled()
  })

  test('isFetching이 로딩 상태를 올바르게 반영한다', async () => {
    const searchText = 'Frozen'
    act(() => {
      useMoviesStore.setState({ searchText })
    })

    // Promise를 지연시켜 로딩 상태 확인
    let resolvePromise: (value: { data: typeof mockMovies }) => void
    const delayedPromise = new Promise<{ data: typeof mockMovies }>(resolve => {
      resolvePromise = resolve
    })

    mockedAxios.get.mockReturnValue(delayedPromise)

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    // 초기 로딩 상태 확인
    expect(result.current.isFetching).toBe(true)
    expect(result.current.isLoading).toBe(true)

    // Promise 해결
    resolvePromise!({ data: mockMovies })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })
})
