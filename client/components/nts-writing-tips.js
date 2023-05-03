import React from 'react';
import { Details } from '@ukhomeoffice/asl-components';

export default function NTSWritingTips() {
  return (
    <Details summary="Tips on writing for the public">
      <ul>
        <li>use short sentences - they’re easier to read</li>
        <li>use bullet points to break up long paragraphs of text</li>
        <li>if you have several points, separate them with headings</li>
        <li>leave out extensive detail or background information - give the information required and no more</li>
        <li>use simple words instead of long words. For example, instead of saying ‘The findings are indicative of…’ say, ‘The findings suggest’ or ‘The findings show’</li>
        <li>avoid technical terms - if that’s not possible, provide an explanation in brackets</li>
      </ul>
    </Details>
  );
}
