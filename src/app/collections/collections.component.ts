import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnInit,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RoutinesService } from '../routines/routines.service';
import { ApiGetRoutines } from '../types';
import { CollectionsService } from './collections.service';

@Component({
  selector: 'app-collections',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
  ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
})
export class CollectionsComponent implements OnInit {
  collections: Signal<Record<string, string[]>>;
  collectionNames: Signal<string[]>;
  activeCollection: WritableSignal<string | null>;
  routines: Signal<ApiGetRoutines['routines']>;
  routineSelection = viewChild<MatSelectionList>('routineSelection');
  routineSelected: Signal<string[]>;

  constructor(
    private collectionsService: CollectionsService,
    private routinesService: RoutinesService,
  ) {
    this.collections = collectionsService.collections;
    this.collectionNames = computed(() => Object.keys(this.collections()));
    const first = Object.keys(this.collections()).at(0) ?? null;
    this.activeCollection = signal<string | null>(first);
    this.routines = routinesService.routines;
    this.routineSelected = computed(() => {
      const activeCollection = this.activeCollection();
      if (!activeCollection) return [];
      return this.collections()[activeCollection] ?? [];
    });
    effect(() => {
      const routineSelection = this.routineSelection();
      if (!routineSelection) {
        throw new Error('selection viewchild not found');
      }
      const routineSelected = this.routineSelected();
      for (const option of routineSelection.options) {
        option.selected = routineSelected.includes(option.value);
      }
    });
  }

  ngOnInit(): void {
    this.routinesService.fetchRoutines();
  }

  selectionChanged() {
    const routineSelection = this.routineSelection();
    if (!routineSelection) {
      throw new Error('selection viewchild not found');
    }
    const activeCollection = this.activeCollection();
    if (!activeCollection) {
      throw new Error('activeCollection is null in selectionChanged');
    }
    const newSelection = routineSelection.selectedOptions.selected.map<string>(
      (options) => options.value,
    );
    this.collectionsService.putToCollection(activeCollection, newSelection);
  }

  addCollection() {
    const name = prompt('Enter collection name'); // TODO: use a dialog
    if (!name) return;
    this.collectionsService.addCollection(name);
  }
}