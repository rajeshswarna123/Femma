import { Injector, OnDestroy, OnInit } from '@angular/core';
// import { OnDestroy, OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

export class BaseComponent implements OnInit, OnDestroy {
  public pageName: string;

  protected subscriptionsToDestroy: Subscription[] = [];

  private titleService: Title;
  private metaService: Meta;

  constructor(
    pageName: string = '',
    private _injector: Injector) {
    this.titleService = _injector.get(Title);
    this.metaService = _injector.get(Meta);
    this.pageName = pageName;
    this.setPageTitle(pageName);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptionsToDestroy.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  protected setPageTitle(title: string) {
    this.titleService.setTitle(title);
    this.metaService.removeTag('property="og:title"');
    this.metaService.addTag({property: 'og:title', content: title});
  }

}
