export type FComponentProps = {};

export type FComponent<
  P extends FComponentProps = FComponentProps,
  C = never
> = (props: P, children?: C) => JSX.Element;
