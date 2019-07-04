import { TestComponent } from '../overview/test';
import {
    LoginService,
    LoginComponent
} from '../overview/login';
import {
    PredictionHistoryService,
    PredictionHistoryComponent
} from '../overview/prediction_history';
import {
    BatchPredictionService,
    BatchPredictionComponent
} from '../overview/batch_prediction';
import {
    SinglePredictionService,
    SinglePredictionComponent
} from '../overview/single_prediction';

import { WarningHistoryComponent } from '../overview/warning_history';

export const OVERVIEWCOMPONENTS = [TestComponent,
    LoginComponent,
    PredictionHistoryComponent,
    SinglePredictionComponent,
    BatchPredictionComponent,
    WarningHistoryComponent
];

export const OVERVIEWSERVICES = [LoginService,
    PredictionHistoryService,
    BatchPredictionService,
    SinglePredictionService
];
