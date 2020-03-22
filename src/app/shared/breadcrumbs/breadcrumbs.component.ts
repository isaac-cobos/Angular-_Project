import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {
  titulo: string;
  description: string;
  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    this.getDataRoute();
  }

  ngOnInit() {}

  getDataRoute() {
    this.router.events
      .pipe(
        filter(evento => evento instanceof ActivationEnd),
        filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
        map((evento: ActivationEnd) => evento.snapshot.data)
      )
      .subscribe(data => {
        this.titulo = data.titulo;
        this.title.setTitle(this.titulo);

        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.titulo
        };
        this.meta.updateTag(metaTag);
      });
  }
}
