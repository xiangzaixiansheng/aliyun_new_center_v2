import { juejinTask } from "../libs/newsGet/juejinhou";
import { AbstractSchedule, IScheduleInfo } from "../util/decorator/AbstractSchedule";


export default class JuejinHouDuanSchedule extends AbstractSchedule {

    constructor(scheduleInfo: IScheduleInfo) {
        super(scheduleInfo);
        this.scheduleInfo = {
            corn: '10 23 * * *',
            name: 'juejin-houtai',
            switch: true
        };
    }

    /**
     * 业务实现
     */
    public async task() {
        await juejinTask('后端','houduan');
    }

}