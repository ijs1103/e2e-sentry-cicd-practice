import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'
import { useMovies, useMoviesStore } from '@/hooks/movies'

jest.mock('@/hooks/movies', () => ({
  useMovies: jest.fn(),
  useMoviesStore: jest.fn()
}))

type StoreState = {
  inputText: string
  setInputText: jest.Mock
  setSearchText: jest.Mock
  resetMovies: jest.Mock
}

describe('<SearchBar>', () => {
  const mockUseMovies = useMovies as unknown as jest.Mock
  const mockUseMoviesStore = useMoviesStore as unknown as jest.Mock

  const setupStore = (overrides: Partial<StoreState> = {}) => {
    const defaultState: StoreState = {
      inputText: '',
      setInputText: jest.fn(),
      setSearchText: jest.fn(),
      resetMovies: jest.fn()
    }
    const state = { ...defaultState, ...overrides }
    mockUseMoviesStore.mockImplementation(selector => selector(state))
    return state
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('검색 바가 정상적으로 렌더링된다', () => {
    setupStore()
    mockUseMovies.mockReturnValue({ isFetching: false })

    render(<SearchBar />)

    expect(
      screen.getByPlaceholderText('Search for a movie')
    ).toBeInTheDocument()
    expect(screen.getByTestId('button-reset')).toBeInTheDocument()
    expect(screen.getByTestId('button-search')).toBeInTheDocument()
  })

  test('입력 필드에 텍스트를 입력하면 setInputText가 호출된다', async () => {
    const store = setupStore()
    mockUseMovies.mockReturnValue({ isFetching: false })

    render(<SearchBar />)

    const input = screen.getByTestId('input-text') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Frozen' } })

    expect(store.setInputText).toHaveBeenCalledTimes(1)
    expect(store.setInputText).toHaveBeenCalledWith('Frozen')
  })

  test('Reset 버튼을 클릭하면 resetMovies가 호출된다', async () => {
    const user = userEvent.setup()
    const store = setupStore()
    mockUseMovies.mockReturnValue({ isFetching: false })

    render(<SearchBar />)

    const resetButton = screen.getByTestId('button-reset')
    await user.click(resetButton)

    expect(store.resetMovies).toHaveBeenCalledTimes(1)
  })

  test('form 제출 시 setSearchText가 호출된다', async () => {
    const user = userEvent.setup()
    const inputText = 'Frozen'
    const store = setupStore({ inputText })
    mockUseMovies.mockReturnValue({ isFetching: false })

    render(<SearchBar />)

    const searchButton = screen.getByTestId('button-search')
    await user.click(searchButton)

    expect(store.setSearchText).toHaveBeenCalledWith(inputText)
  })

  test('isFetching이 true일 때 Search 버튼에 로딩 상태가 표시된다', () => {
    setupStore()
    mockUseMovies.mockReturnValue({ isFetching: true })

    render(<SearchBar />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  test('Search 버튼은 submit 타입이다', () => {
    setupStore()
    mockUseMovies.mockReturnValue({ isFetching: false })

    render(<SearchBar />)

    expect(screen.getByTestId('button-search')).toHaveAttribute(
      'type',
      'submit'
    )
  })
})
