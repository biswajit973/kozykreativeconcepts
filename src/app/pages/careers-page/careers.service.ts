import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { JobsDataset, JobsDatasetRaw } from './careers.models';
import { createEmptyDataset, normalizeJobsDataset } from './utils/careers-rotation.util';

@Injectable({ providedIn: 'root' })
export class CareersService {
  private readonly http = inject(HttpClient);

  private readonly dataset$: Observable<JobsDataset> = this.http.get<JobsDatasetRaw>('/jsons/jobs.json').pipe(
    map((response) => normalizeJobsDataset(response)),
    catchError(() =>
      this.http.get<JobsDatasetRaw>('/assets/jsons/jobs.json').pipe(map((response) => normalizeJobsDataset(response)))
    ),
    catchError(() => of(createEmptyDataset())),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  getJobsDataset(): Observable<JobsDataset> {
    return this.dataset$;
  }
}
