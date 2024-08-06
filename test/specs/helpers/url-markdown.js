import assert from 'assert';
import {getCurrentURLForFateOfAnimals, UrlMarkdown} from '../../../client/helpers';

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
    window.location.href = '';
    const result = getCurrentURLForFateOfAnimals();
    assert.strictEqual(result, null);
  });
});

describe('UrlMarkdown', () => {
  it('should return the anchor name with the correct URL markdown', () => {
    window.location.href = 'https://example.com/edit/some-page';
    const anchoreName = 'Fate of Animals';
    const expectedMarkdown = '[Fate of Animals](https://example.com/edit/fate-of-animals)';
    const result = UrlMarkdown(anchoreName);
    assert.strictEqual(result, expectedMarkdown);
  });

  it('should return the anchor name if URL is null', () => {
    // Mock the href to be null
    window.location.href = '';
    const anchoreName = 'Fate of Animals';
    const result = UrlMarkdown(anchoreName);
    assert.strictEqual(result, anchoreName);
  });
});
