import { uploadFiles, merge } from '../../api/file'
import { format } from "../../utils/data";
import { getMD5 } from "../../utils/cryto";
import { mapActions } from 'vuex'
let uploadFileMixin = {
    data() {
        return {
            loading: false,
            chunkSize: 1024 * 1024,
            partList: [],
            total: 0,
            index: 0,
            upload_name: "",
            upload_Ele: false,
            percentage: 0,
        }
    },
    methods: {
        // 上传文件
        async upload(e) {
            let { drive_used, drive_size } = this.userInfo;
            if (drive_used >= drive_size)
                return this.$message.error("当前账户可用空间不足");
            var file = e.target.files[0];
            if (!file) return;
            this.upload_name = file.name;
            let start = 0;
            while (start <= file.size) {
                start = this.total * this.chunkSize;
                let [f_name, f_ext] = file.name.split(".");
                let blob = file.slice(start, start + this.chunkSize);
                let blob_name = `${f_name}.${this.total}.${f_ext}`;
                let bolo_file = new File([blob], blob_name);
                this.partList.push(bolo_file);
                this.total += 1;
                if (start >= file.size) {
                    break;
                }
            }
            this.sendRequest(e);
        },
        // 更新上传进度
        progressPerce(index) {
            let result = parseInt((index / this.total) * 100);
            this.percentage = result == 100 ? 99 : result;
        },
        // 发送上传请求
        async sendRequest(e) {
            this.upload_Ele = true;
            this.index = 0;
            let list = this.partList,
                listLength = list.length;
            for (let i = 0; i < listLength; i++) {
                let formData = new FormData();
                formData.append("file", list.shift());
                await uploadFiles(formData);
                this.index++;
                this.progressPerce(this.index);
            }
            setTimeout(() => {
                this.mergeFile(e);
            }, 4000);
        },
        // 合并文件
        mergeFile(e) {
            var files = e.target.files[0];
            var file_name = files.name;
            var file_id = getMD5(file_name);
            var file_size = files.size;
            var file_type = files.type;
            let time = format("YYYY-MM-DD hh:mm:ss");
            let { drive_id } = this.userInfo;
            let parent_file_id = this.parent_file_id;
            merge({
                drive_id,
                file_id,
                file_name,
                parent_file_id,
                file_size,
                file_type,
                created_at: time,
                updated_at: time,
            }).then(async (res) => {
                await this.getUserDrive();
                if (this.getUserFile) return this.getUserFile()
                this.$refs.folder.getUserFile();
                this.$message.success(res.message);
            });
            this.upload_Ele = false;
            this.total = 0;
            this.index = 0;
            this.percentage = 0;
        },
        ...mapActions("user", ["getUserDrive"]),
    }

}
export default uploadFileMixin