type SizeObject = {
  span: number;
  offset: number;
}

export interface ColProps {
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
  xs?: number | SizeObject;
  sm?: number | SizeObject;
  md?: number | SizeObject;
  lg?: number | SizeObject;
  xl?: number | SizeObject;
}

export interface RowProps {
  gutter?: number;
  justify?: string;
  align?: string;
}

export const getColClassList = (props: ColProps, rowProps: RowProps) => {
  const { gutter } = rowProps;
  const ret: string[] = [];
  const pos = ['span', 'offset', 'pull', 'push'] as const;
  pos.forEach((prop) => {
    const size = props[prop];

    if (typeof size === 'number') {
      if (prop === 'span') ret.push(`el-col-${props[prop]}`);
      else if (size > 0) ret.push(`el-col-${prop}-${props[prop]}`);
    }
  });

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  sizes.forEach((size) => {
    if (typeof props[size] === 'number') {
      ret.push(`el-col-${size}-${props[size]}`);
    } else if (typeof props[size] === 'object') {
      const sizeProps = props[size]!;
      Object.keys(sizeProps).forEach((prop) => {
        const _classKey = sizeProps[prop as keyof typeof sizeProps];
        ret.push(
          prop !== 'span' ? `el-col-${size}-${prop}-${_classKey}` : `el-col-${size}-${_classKey}`,
        );
      });
    }
  });

  if (gutter) {
    ret.push('is-guttered');
  }

  return ret;
};

export const getColStyle = (rowProps: RowProps) => {
  const { gutter } = rowProps;

  if (gutter) {
    const val = `${gutter / 2}px`;
    return {
      paddingLeft: val,
      paddingRight: val,
    };
  }
  return {};
};
