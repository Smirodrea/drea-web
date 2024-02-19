import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

interface Step {
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper | undefined;
  currentStepBackgroundImage: string | undefined;

  isStepVisible(index: number): boolean {
    if (!this.stepper || !this.stepper.selected) {
      return false;
    }

    const selectedStepIndex = this.stepper.selectedIndex;

    // Show the current step and previous steps
    return index <= selectedStepIndex;
  }

  ngOnInit(): void {
    this.currentStepBackgroundImage = 'url("./../../../assets/images/real-estate-market-explosion.jpg")';
  }

  steps: Step[] = [
    {
      title: 'Step 1: Submit Your Numbers',
      description: 'The seller and the buyer both submit their preferred numbers for the transaction.'
    },
    {
      title: 'Step 2: Automatic Calculation',
      description: 'Our state-of-the-art algorithm processes the submitted numbers, taking into account all factors to compute an optimal price.'
    },
    {
      title: 'Step 3: Final Price Presentation',
      description: 'The final price is presented to both parties. At this stage, you can decide to close or decline the deal.'
    },
  ];

  updateBackgroundImage(): void {
    const step = this.stepper?.selectedIndex;

    switch (step) {
      case 0:
        this.currentStepBackgroundImage = 'url("./../../../assets/images/real-estate-market-explosion.jpg")';
        break;
      case 1:
        this.currentStepBackgroundImage = 'url("./../../../assets/images/real-estate-market-explosion.jpg")';
        break;
      case 2:
        this.currentStepBackgroundImage = 'url("./../../../assets/images/real-estate-market-explosion.jpg")';
        break;
      default:
        this.currentStepBackgroundImage = 'none';
        break;
    }
  }

  constructor() { }
}
