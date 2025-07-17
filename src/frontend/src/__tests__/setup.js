import '@testing-library/jest-dom';

// Mock Shopify Polaris components to avoid complex rendering
jest.mock('@shopify/polaris', () => {
  // Import React inside the mock factory to avoid out-of-scope variable access
  const React = require('react');
  
  // Create Modal component with Section subcomponent
  const Modal = Object.assign(
    ({ children, open, onClose, title }) => open ? React.createElement(
      'div',
      { 'data-testid': 'modal', role: 'dialog', 'aria-label': title },
      React.createElement('button', { 'data-testid': 'modal-close', onClick: onClose }, '×'),
      children
    ) : null,
    {
      Section: ({ children }) => React.createElement(
        'div',
        { 'data-testid': 'modal-section' },
        children
      )
    }
  );

  // Create Layout component with Section subcomponent
  const Layout = Object.assign(
    ({ children }) => React.createElement('div', { 'data-testid': 'layout' }, children),
    {
      Section: ({ children }) => React.createElement(
        'div',
        { 'data-testid': 'layout-section' },
        children
      )
    }
  );
  
  return {
    AppProvider: ({ children }) => children,
    Page: ({ children, title }) => React.createElement('div', { 'data-testid': 'page', title }, children),
    Layout,
    Card: ({ children, title }) => React.createElement('div', { 'data-testid': 'card', title }, children),
    Text: ({ children, variant, as }) => React.createElement(as || 'span', { 'data-testid': 'text', 'data-variant': variant }, children),
    Button: ({ children, onClick, primary, disabled }) => React.createElement(
      'button',
      { 'data-testid': 'button', onClick, disabled, 'data-primary': primary },
      children
    ),
    TextField: ({ label, value, onChange, ...props }) => React.createElement(
      'input',
      {
        'data-testid': 'text-field',
        'aria-label': label,
        value,
        onChange: (e) => onChange?.(e.target.value),
        ...props
      }
    ),
    Select: ({ label, options, value, onChange }) => React.createElement(
      'select',
      {
        'data-testid': 'select',
        'aria-label': label,
        value,
        onChange: (e) => onChange?.(e.target.value)
      },
      options?.map((option) => React.createElement(
        'option',
        { key: option.value, value: option.value },
        option.label
      ))
    ),
    Checkbox: ({ label, checked, onChange }) => {
      // Extract text content from complex labels
      let labelText = '';
      if (typeof label === 'string') {
        labelText = label;
      } else if (React.isValidElement(label)) {
        // For complex JSX labels, try to extract text content
        const extractText = (element) => {
          if (typeof element === 'string') return element;
          if (typeof element === 'number') return element.toString();
          if (React.isValidElement(element)) {
            if (element.props.children) {
              if (Array.isArray(element.props.children)) {
                return element.props.children.map(extractText).join(' ');
              }
              return extractText(element.props.children);
            }
          }
          return '';
        };
        labelText = extractText(label);
      }
      
      return React.createElement(
        'input',
        {
          'data-testid': 'checkbox',
          type: 'checkbox',
          'aria-label': labelText,
          checked,
          onChange: (e) => onChange?.(e.target.checked)
        }
      );
    },
    RadioButton: ({ label, checked, onChange, id }) => React.createElement(
      'input',
      {
        'data-testid': 'radio-button',
        type: 'radio',
        id,
        'aria-label': label,
        checked,
        onChange
      }
    ),
    Badge: ({ children, status }) => React.createElement(
      'span',
      { 'data-testid': 'badge', 'data-status': status },
      children
    ),
    Banner: ({ children, status, title }) => React.createElement(
      'div',
      { 'data-testid': 'banner', 'data-status': status },
      title && React.createElement('h4', null, title),
      children
    ),
    Modal,
    DropZone: Object.assign(
      ({ children, onDrop, accept, type, allowMultiple }) => React.createElement(
        'div',
        { 
          'data-testid': 'drop-zone',
          onDrop: (e) => {
            if (onDrop) {
              const files = Array.from(e.dataTransfer?.files || []);
              onDrop(files);
            }
          }
        },
        children
      ),
      {
        FileUpload: ({ actionTitle, actionHint }) => React.createElement(
          'div',
          { 'data-testid': 'file-upload' },
          React.createElement('div', null, actionTitle),
          React.createElement('div', null, actionHint)
        )
      }
    ),
    Thumbnail: ({ source, alt }) => React.createElement(
      'img',
      { 'data-testid': 'thumbnail', src: source, alt }
    ),
    Toast: ({ content, onDismiss }) => React.createElement(
      'div',
      { 'data-testid': 'toast' },
      content,
      React.createElement('button', { onClick: onDismiss }, '×')
    ),
    Frame: ({ children }) => React.createElement('div', { 'data-testid': 'frame' }, children),
    FormLayout: ({ children }) => React.createElement('div', { 'data-testid': 'form-layout' }, children),
    DataTable: ({ columnContentTypes, headings, rows }) => React.createElement(
      'table',
      { 'data-testid': 'data-table' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          headings.map((heading, index) => React.createElement('th', { key: index }, heading))
        )
      ),
      React.createElement(
        'tbody',
        null,
        rows.map((row, index) => React.createElement(
          'tr',
          { key: index },
          row.map((cell, cellIndex) => React.createElement('td', { key: cellIndex }, cell))
        ))
      )
    ),
    // New Polaris v12 Components
    BlockStack: ({ children, spacing, align }) => React.createElement(
      'div',
      { 
        'data-testid': 'block-stack',
        'data-spacing': spacing,
        'data-align': align
      },
      children
    ),
    InlineStack: ({ children, spacing, align }) => React.createElement(
      'div',
      { 
        'data-testid': 'inline-stack',
        'data-spacing': spacing,
        'data-align': align
      },
      children
    ),
    // Legacy components for backwards compatibility
    LegacyStack: ({ children, vertical, spacing, alignment, distribution }) => React.createElement(
      'div',
      { 
        'data-testid': 'legacy-stack',
        'data-vertical': vertical,
        'data-spacing': spacing,
        'data-alignment': alignment,
        'data-distribution': distribution
      },
      children
    ),
    Icon: ({ source, color }) => React.createElement(
      'span',
      { 'data-testid': 'icon', 'data-color': color, 'data-source': source }
    ),
    Tooltip: ({ children, content }) => React.createElement(
      'div',
      { 'data-testid': 'tooltip', 'data-content': content },
      children
    ),
    Caption: ({ children }) => React.createElement(
      'p',
      { 'data-testid': 'caption' },
      children
    ),
    TextContainer: ({ children }) => React.createElement(
      'div',
      { 'data-testid': 'text-container' },
      children
    ),
    Collapsible: ({ children, open }) => open ? React.createElement(
      'div',
      { 'data-testid': 'collapsible' },
      children
    ) : null,
    Stack: ({ children, vertical, spacing, alignment }) => React.createElement(
      'div',
      { 
        'data-testid': 'stack',
        'data-vertical': vertical,
        'data-spacing': spacing,
        'data-alignment': alignment
      },
      children
    ),
    ButtonGroup: ({ children, segmented }) => React.createElement(
      'div',
      { 'data-testid': 'button-group', 'data-segmented': segmented },
      children
    ),
    Divider: () => React.createElement(
      'hr',
      { 'data-testid': 'divider' }
    ),
    Link: ({ children, url, onClick, external }) => React.createElement(
      'a',
      { 
        'data-testid': 'link',
        href: url,
        onClick,
        target: external ? '_blank' : undefined,
        rel: external ? 'noopener noreferrer' : undefined
      },
      children
    ),
    Spinner: ({ size, color }) => React.createElement(
      'div',
      { 
        'data-testid': 'spinner',
        'data-size': size,
        'data-color': color
      },
      'Loading...'
    )
  };
});

// Mock Shopify Polaris Icons - Updated for v12
jest.mock('@shopify/polaris-icons', () => ({
  InfoIcon: 'info-icon', // Legacy support
  CircleInformationMajor: 'circle-information-major',
  ViewMajor: 'view-major'
}));

// Mock Shopify App Bridge
jest.mock('@shopify/app-bridge-react', () => ({
  Provider: ({ children }) => children,
  useAppBridge: () => ({
    dispatch: jest.fn()
  })
}));

// Mock react-router-dom with hooks
jest.mock('react-router-dom', () => {
  // Import React inside the mock factory to avoid out-of-scope variable access
  const React = require('react');
  
  return {
    BrowserRouter: ({ children }) => React.createElement('div', { 'data-testid': 'router' }, children),
    Routes: ({ children }) => React.createElement('div', { 'data-testid': 'routes' }, children),
    Route: ({ element, path }) => React.createElement('div', { 'data-testid': 'route', 'data-path': path }, element),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
    Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
    NavLink: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
    Navigate: ({ to }) => React.createElement('div', { 'data-testid': 'navigate', 'data-to': to })
  };
});

// Mock React imports for tests
global.React = require('react');

// Suppress console warnings in tests
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
}); 