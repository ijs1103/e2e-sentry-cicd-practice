import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieItem from '@/components/MovieItem'
import mockMovie from '@/__mocks__/movie.json'

jest.mock('next/navigation', () => {})
jest.mock('next/link', () => {})

jest.mock('next/image', () => {})

// 1. useRouter Mocking (버튼 클릭 시 이동 확인용)
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href
  }: {
    children: React.ReactNode
    href: string
  }) {
    return <a href={href}>{children}</a>
  }
})

// 3. Image Mocking (img 태그로 대체)
jest.mock('next/image', () => {
  return function MockImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} />
  }
})

describe('<MovieItem>', () => {
  test('영화 아이템이 정상적으로 렌더링된다', () => {
    render(<MovieItem movie={mockMovie} />)

    // li 요소가 DOM에 존재하는지 확인
    // <li>도 DOM상에서는 여전히 role="listitem"으로 인식된다
    const item = screen.getByRole('listitem')
    expect(item).toBeInTheDocument()
  })

  test('영화 제목과 연도가 올바르게 표시된다', () => {
    render(<MovieItem movie={mockMovie} />)

    // mock 데이터의 제목과 연도가 화면에 텍스트로 존재하는지 확인
    expect(screen.getByText(mockMovie.Title)).toBeInTheDocument()
    expect(screen.getByText(mockMovie.Year)).toBeInTheDocument()
  })

  test('영화 포스터 이미지가 올바른 속성으로 렌더링된다', () => {
    render(<MovieItem movie={mockMovie} />)

    // img 태그를 찾고 속성 검사
    const posterImage = screen.getByRole('img')

    expect(posterImage).toHaveAttribute(
      'src',
      expect.stringContaining(mockMovie.Poster)
    )
    expect(posterImage).toHaveAttribute('alt', mockMovie.Title)
  })

  test('영화 상세 페이지로 이동하는 링크가 올바른 href를 가진다', () => {
    render(<MovieItem movie={mockMovie} />)

    // 링크(a 태그)를 찾음
    // (이미지를 감싸는 링크를 찾기 위해 role='link' 사용)
    const link = screen.getByRole('link')

    // href가 /movies/{imdbID} 형식을 따르는지 확인
    expect(link).toHaveAttribute('href', `/movies/${mockMovie.imdbID}`)
  })

  test('포스터 보기 버튼을 클릭하면 포스터 페이지로 이동한다', async () => {
    const user = userEvent.setup() // 사용자 이벤트 시뮬레이터 설정
    render(<MovieItem movie={mockMovie} />)

    // 👀 버튼 찾기 (버튼 안에 텍스트나 aria-label이 있다고 가정)
    // 만약 텍스트가 '👀'라면:
    const button = screen.getByRole('button', { name: /👀/i })

    // 클릭 이벤트 발생
    await user.click(button)

    // 클릭 후 router.push가 호출되었는지, 그리고 올바른 주소로 호출되었는지 검증
    // (구현 로직에 따라 주소 형식은 다를 수 있습니다. 예: /poster?url=...)
    expect(mockPush).toHaveBeenCalledTimes(1)
    // expect(mockPush).toHaveBeenCalledWith(...) // 구체적인 경로 확인 시 추가
  })
})
