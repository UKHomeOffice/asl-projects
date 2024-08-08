import assert from 'assert';
import {getCurrentURLForFateOfAnimals, markdownLink} from '../../../client/helpers';

// Mock window object
global.window = {
  location: {
    href: 'https://example.com/edit/some-page'
  }
};

describe('getCurrentURLForFateOfAnimals', () => {
  it('should return the correct URL for fate-of-animals', () => {
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
