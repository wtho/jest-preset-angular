import inlineAngularTemplatePlugin from '../babel/plugin-inline-angular-template';
import { transformSync as babelTransform } from '@babel/core';

const CODE_WITH_TEMPLATE_URL = `
  import { Component } from '@angular/core';

  @Component({
    templateUrl: './page.html'
  })
  export class AngularComponent {
  }
`;

const CODE_WITH_NON_RELATIVE_TEMPLATE_URL = `
  import { Component } from '@angular/core';

  @Component({
    templateUrl: 'page.html'
  })
  export class AngularComponent {
  }
`;

const CODE_WITH_STYLE_URLS = `
  import { Component } from '@angular/core';

  @Component({
    styleUrls: [
      './fancy-styles.css',
      './basic-styles.scss'
    ]
  })
  export class AngularComponent {
  }
`;

const CODE_WITH_STYLES = `
  import { Component } from '@angular/core';

  @Component({
    styles: [
      'body { display: none }',
      'html { background-color: red }'
    ]
  })
  export class AngularComponent {
  }
`;

const CODE_WITH_ALL_DECORATOR_PROPERTIES = `
  import { Component } from '@angular/core';

  @SomeDecorator({
    value: 'test'
  })
  @Component({
    templateUrl: './page.html',
    styleUrls: [
      './fancy-styles.css',
      './basic-styles.scss'
    ],
    styles: [
      'body { display: none }',
      'html { background-color: red }'
    ],
    unaffectedProperty: 'whatever'
  })
  @SomeOtherDecorator({
    prop: 'ok'
  })
  export class AngularComponent {
  }
`;

const CODE_WITH_CUSTOM_DECORATOR = `
  import { Component as CustomDecoratorName } from '@angular/core';

  @CustomDecoratorName({
    templateUrl: './page.html'
  })
  export class AngularComponent {
  }
`;

const CODE_TEST_WITH_TEMPLATE_URL_OVERRIDE = `
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AComponent } from './a.component';

describe('AComponent', () => {
  let fixture: ComponentFixture<AComponent>,
  instance: AComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AComponent,
      ],
    }).overrideComponent(AComponent, {
      set: {
        templateUrl: '../__mocks__/alert-follow-stub.component.html',
      },
    });

    fixture = TestBed.createComponent(AComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should render the component', () => {
    expect(fixture).toMatchSnapshot();
  });
});
`;

const CODE_WITH_ASSIGNMENTS_OUTSIDE_DECORATOR = `
  const assignmentsToNotBeTransformed = {
    styles: [{
      color: 'red'
    }]
  };
  const assignmentsToBeTransformed = {
    styleUrls: ['./some-styles.css'],
    templateUrl: './some-styles.css'
  };
`;

const defaultBabelOptions = {
  filename: 'testee.component.ts',
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    inlineAngularTemplatePlugin
  ]
};
const transpile = (source: string) => babelTransform(source, defaultBabelOptions);
  

describe('inlining template and stripping styleUrls', () => {
  it('should strip styleUrls assignment', () => {
    const out = transpile(CODE_WITH_STYLE_URLS);

    expect(out.code).toMatchSnapshot();
  });

  it('should inline templateUrl assignment', () => {
    const out = transpile(CODE_WITH_TEMPLATE_URL);

    expect(out.code).toMatchSnapshot();
  });

  it('should not strip styles assignment', () => {
    const out = transpile(CODE_WITH_STYLES);

    expect(out.code).toMatchSnapshot();
  });

  it('should inline non-relative templateUrl assignment and make it relative', () => {
    const out = transpile(CODE_WITH_NON_RELATIVE_TEMPLATE_URL);

    expect(out.code).toMatchSnapshot();
  });

  it('should handle all transformable decorator assignments', () => {
    const out = transpile(CODE_WITH_ALL_DECORATOR_PROPERTIES);

    expect(out.code).toMatchSnapshot();
  });

  it('should handle all decorator assignments in differently named decorators', () => {
    const out = transpile(CODE_WITH_CUSTOM_DECORATOR);

    expect(out.code).toMatchSnapshot();
  });

  it('should handle templateUrl in test file outside decorator', () => {
    const out = transpile(CODE_TEST_WITH_TEMPLATE_URL_OVERRIDE);

    expect(out.code).toMatchSnapshot();
  });

  it('should not transform styles outside decorator', () => {
    const out = transpile(CODE_WITH_ASSIGNMENTS_OUTSIDE_DECORATOR);

    expect(out.code).toMatchSnapshot();
  });
});