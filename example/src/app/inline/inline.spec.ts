import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

/**
 * Example test component.
 */
@Component({
  selector: "tc-jest-inline-test1",
  template: `
    <div>Line 1</div>
    <div>
      <div *ngIf="condition1">
        {{ value1 }}
      </div>
      <span *ngIf="condition2">
        {{ value2 }}
      </span>
    </div>
  `
})
export class JestInlineSnapBugComponent {
  @Input() value1: string = "val1";
  @Input() value2: string = "val2";

  condition1: boolean = true;
  condition2: boolean = false;
}

describe("Jest Snapshot Bug", () => {
  let comp: JestInlineSnapBugComponent;
  let fixture: ComponentFixture<JestInlineSnapBugComponent>;

  beforeEach(() => {
    TestBed.configureCompiler({ preserveWhitespaces: false } as any);
    TestBed.configureTestingModule({
      declarations: [JestInlineSnapBugComponent]
    });
    fixture = TestBed.createComponent(JestInlineSnapBugComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should allow snapshots", () => {
    expect(fixture).toMatchInlineSnapshot();

    comp.condition2 = true;
    fixture.detectChanges();
    expect(fixture).toMatchInlineSnapshot();

    comp.condition1 = false;
    comp.condition2 = false;
    expect(fixture).toMatchInlineSnapshot();
  });
});
