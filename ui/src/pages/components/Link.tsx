export const Link: React.FC = (props) => {
  console.log('in here', props.children);
  return <button style={{ background: 'red' }}>{props.children}</button>;
};
