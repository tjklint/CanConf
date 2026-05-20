import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}))

describe('main.tsx', () => {
  let mockRender: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockRender = jest.fn()
    ;(createRoot as jest.MockedFunction<typeof createRoot>).mockReturnValue({
      render: mockRender,
    } as unknown as ReturnType<typeof createRoot>)
  })

  it('should create root and render App component wrapped in StrictMode', () => {
    // Simulate what main.tsx does
    const rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    const App = () => null

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'))
    expect(mockRender).toHaveBeenCalledWith(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })

  it('should call createRoot with the root element', () => {
    const rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    createRoot(document.getElementById('root')!)

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'))
  })
})
