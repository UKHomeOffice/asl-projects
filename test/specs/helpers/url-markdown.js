import assert from 'assert';
import {getCurrentURLForFateOfAnimals, markdownLink} from '../../../client/helpers';

// Mock window object
let prevWindow = null;

const mockLocationHref = (url) => {
  prevWindow = global.window;
  global.window = {
    location: {
      href: url
    }
  };
};

const resetWindow = () => {
  if (prevWindow !== null) {
    global.window = prevWindow;
    prevWindow = null;
  }
};

describe('getCurrentURLForFateOfAnimals', () => {
  afterEach(() => { resetWindow(); });

  it('should return the correct URL for fate-of-animals', () => {
    mockLocationHref('https://example.com/edit/some-page');
    const expectedURL = 'https://example.com/edit/fate-of-animals';

    const result = getCurrentURLForFateOfAnimals();

    assert.strictEqual(result, expectedURL);
  });

  it('should return null if window.location.href is not set', () => {
    // Mock the href to be null
    const prevWindow = window;
    // eslint-disable-next-line no-global-assign
    window = undefined;

    const result = getCurrentURLForFateOfAnimals();
    assert.strictEqual(result, null);

    // eslint-disable-next-line no-global-assign
    window = prevWindow;
  });

  it('should return an appropriate url when rendering the full application', () => {
    mockLocationHref('https://example.com/full-application/some-page');
    const expectedURL = 'https://example.com/full-application/fate-of-animals';

    const result = getCurrentURLForFateOfAnimals();

    assert.strictEqual(result, expectedURL);
  });

  it('should return null when rendering on an unexpected page', () => {
    mockLocationHref('https://example.com/some-other-route/some-page');

    const result = getCurrentURLForFateOfAnimals();

    assert.strictEqual(result, null);
  });
});

describe('markdownLink', () => {
  it('should return the anchor name with the correct URL markdown', () => {
    const anchorName = 'Fate of Animals';
    const url = 'https://example.com/edit/fate-of-animals';
    const expectedMarkdown = '[Fate of Animals](https://example.com/edit/fate-of-animals)';

    const result = markdownLink(anchorName, url);

    assert.strictEqual(result, expectedMarkdown);
  });

  it('should return the anchor name if URL is null', () => {
    const anchorName = 'Fate of Animals';

    const result = markdownLink(anchorName, null);

    assert.strictEqual(result, anchorName);
  });
});
