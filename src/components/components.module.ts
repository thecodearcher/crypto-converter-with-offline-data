import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { ConversionComponent } from './conversion/conversion.component';

@NgModule({
	declarations: [ConversionComponent,
    ],
	imports: [IonicModule],
	exports: [ConversionComponent,
    ]
})
export class ComponentsModule {}
