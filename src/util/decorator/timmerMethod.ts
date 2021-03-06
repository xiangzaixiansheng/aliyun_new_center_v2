import { AbstractSchedule, IScheduleInfo } from "./AbstractSchedule";
import { readdir } from 'fs';
const path = require('path');

/**
 * @description 定时任务加载类
 */

class ScheduleHelper {

    private scheduleList: Array<AbstractSchedule> = [];
    /**
     * 远程配置的定时任务
     */
    private async initTaskFromConfig() {
        const prod = process.env.NODE_ENV === 'prod';
        const timerTaskPath = prod ? path.resolve('__dirname', '../dist/timer') : path.resolve('__dirname', '../src/timer');
        console.info(`[schedule]timer路径加载path`, timerTaskPath);
        try {
            const taskList = await this.readdir(timerTaskPath);
            for (const taskItem of taskList) {
                let taskItemPath = path.resolve(timerTaskPath, taskItem);
                console.info(`[schedule]timer路径加载taskItem`, taskItemPath);
                //import 动态引入路径 返回promise https://www.jianshu.com/p/386916c73dad
                await import(taskItemPath).then((module) => {
                    const scheduleItem: AbstractSchedule = new module.default();
                    console.info(`[schedule]scheduleItem`, scheduleItem);
                    this.scheduleList.push(scheduleItem);
                }, (err) => {
                    console.error(`[schedule]初始化失败，找不到配置文件 ${err.message}`);
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * 启动入口
     */
    public async taskListRun() {
        await this.initTaskFromConfig();
        console.info(`[schedule]schedulelist======, ${this.scheduleList}`);
        for (const schedule of this.scheduleList) {
            console.info(`[schedule]schedule******${schedule}, ${schedule.scheduleInfo.switch}`)
            if (schedule.scheduleInfo.switch) {
                schedule.start();
            }
        }
    }

    private readdir(filepath: string): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            readdir(filepath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            })
        });
    }

}

export default new ScheduleHelper();