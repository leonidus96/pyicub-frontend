import {Component, OnInit} from '@angular/core';
import { WidgetBaseComponent } from '../../widget-base/widget-base.component';
import {InputNode} from "../../graphy/models/input-node.model";

@Component({
  selector: 'app-actions-manager',
  templateUrl: './actions-manager.component.html',
  styleUrl: './actions-manager.component.css'
})
export class ActionsManagerComponent extends WidgetBaseComponent implements OnInit {

  actions:Action[] = []
  isLoading = true;

  nodeColors = {
    INACTIVE: 'gray',
    ACTIVE: 'white',
    RUNNING: 'yellow',
    FAILED: 'red',
    DONE: 'green'
  }

  ngOnInit() {
    this.getRobotActions().subscribe(actions => {
      const newActions:Action[] = actions.map(action => {
        return {actionID:action,actionState:ActionState.ACTIVE}
      })
      this.actions = newActions;
      this.isLoading = false;
      console.log(this.actions)
    })
  }

  onActionClick(selectedAction:Action){

    if(selectedAction.actionState === ActionState.ACTIVE) {

      this.actions.forEach(action => {
        if(selectedAction.actionID !== action.actionID){
          this.updateActionState(action,ActionState.INACTIVE)
        }
      })

      this.playActionAsync(selectedAction.actionID).subscribe(reqID => {

        const onRunning = () => {
          this.updateActionState(selectedAction,ActionState.RUNNING)
        }

        const onDone = () => {

          this.updateActionState(selectedAction,ActionState.DONE)
          setTimeout(() => {
            this.actions.forEach(action => {
              this.updateActionState(action,ActionState.ACTIVE)
            })
          },2000)

        }

        const onFailed = () => {

          this.updateActionState(selectedAction,ActionState.FAILED)
          setTimeout(() => {
            this.actions.forEach(action => {
              this.updateActionState(action,ActionState.ACTIVE)
            })
          },2000)
        }

        this.checkAsyncRequestStatus(reqID, undefined, onRunning, onDone, onFailed)

      })
    } else {
      console.log("INATTIVO")
    }
  }

  private updateActionState(actionToUpdate:Action,updatedState:ActionState){
    this.actions = this.actions.map(action => {
      if(action.actionID === actionToUpdate.actionID){
        return {actionID:action.actionID,actionState:updatedState}
      }
      return action
    })
  }

}

interface Action{
  actionID:string
  actionState:ActionState
}

enum ActionState{
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  RUNNING = "RUNNING",
  DONE = "DONE",
  FAILED = "FAILED"
}
