import { Button, H1, Paragraph, Spacing } from '.';
import { PageLayout, LayoutType } from '../common/pageLayout';
import { Resources } from '../common/resourceData';
import { fillLayout } from '../common/loadLayout';

export interface DynamicRendererProps {
  layout: PageLayout;
  resources: Resources;
}

export const DynamicRenderer = ({ layout, resources }: DynamicRendererProps): JSX.Element => {
  const filledLayout = fillLayout(layout, resources);

  return (
    <>
      {filledLayout.layout.map((element, index) => {
        switch (element.type) {
          case LayoutType.BUTTON:
            return <Button key={index} content={element.content} />;
          case LayoutType.H1:
            return <H1 key={index} content={element.content} />;
          case LayoutType.PARAGRAPH:
            return <Paragraph key={index} content={element.content} />;
          case LayoutType.SPACING:
            return <Spacing key={index} content={element.content} />;
          default:
            console.warn('Unrecognized type', element.type);
            return null;
        }
      })}
    </>
  );
};
