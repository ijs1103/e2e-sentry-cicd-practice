import { render, screen } from '@testing-library/react'
import MovieList from '@/components/MovieList'
import { useMovies, useMoviesStore } from '@/hooks/movies'
import mockMovies from '@/__mocks__/movies.json'

jest.mock('@/hooks/movies', () => ({
  useMovies: jest.fn(),
  useMoviesStore: jest.fn()
}))

jest.mock('@/components/MovieItem', () => ({
  __esModule: true,
  default: ({ movie }: { movie: { Title: string } }) => (
    <li role="listitem">{movie.Title}</li>
  )
}))

describe('<MovieList>', () => {
  const mockUseMovies = useMovies as unknown as jest.Mock
  const mockUseMoviesStore = useMoviesStore as unknown as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('영화 목록이 정상적으로 렌더링된다', () => {
    mockUseMovies.mockReturnValue({ data: mockMovies.Search })
    mockUseMoviesStore.mockImplementation(
      (selector: (state: { message: string }) => string) =>
        selector({ message: '검색 메시지' })
    )

    render(<MovieList />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(mockMovies.Search.length)
  })

  test('영화 목록이 비어있고 메시지가 있을 때 메시지가 표시된다', () => {
    const emptyMovies: [] = []
    const message = '검색 결과가 없습니다.'
    mockUseMovies.mockReturnValue({ data: emptyMovies })
    mockUseMoviesStore.mockImplementation(
      (selector: (state: { message: string }) => string) =>
        selector({ message })
    )

    render(<MovieList />)

    expect(screen.getByText(message)).toBeInTheDocument()
  })

  test('영화 목록이 있을 때는 메시지가 표시되지 않는다', () => {
    const message = '검색 메시지'
    mockUseMovies.mockReturnValue({ data: mockMovies.Search })
    mockUseMoviesStore.mockImplementation(
      (selector: (state: { message: string }) => string) =>
        selector({ message })
    )

    render(<MovieList />)

    expect(screen.queryByText(message)).not.toBeInTheDocument()
  })

  test('영화 목록이 undefined일 때 메시지가 표시된다', () => {
    const message = '검색 메시지'
    mockUseMovies.mockReturnValue({ data: undefined })
    mockUseMoviesStore.mockImplementation(
      (selector: (state: { message: string }) => string) =>
        selector({ message })
    )

    render(<MovieList />)

    expect(screen.getByText(message)).toBeInTheDocument()
  })
})
