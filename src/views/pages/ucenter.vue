<template>
    <div>
        <div class="user-container">
            <el-card class="user-profile" shadow="hover" :body-style="{ padding: '0px' }">
                <div class="user-profile-bg"></div>
                <div class="user-avatar-wrap">
                    <el-avatar class="user-avatar" :size="120">
                        <template v-if="user.avatar">
                            <img :src="user.avatar" alt="avatar">
                        </template>
                        <template v-else>
                            {{ user.name }}
                        </template>
                    </el-avatar>
                </div>
                <div class="user-info">
                    <div class="info-name">{{ user.name }}</div>
                    <div class="info-desc">
                        <span>{{ `@${user.username}` }}</span>
                        <el-divider direction="vertical" />
                        <span>{{ `${user.email}` }}</span>
                        <!-- <el-link href="https://lin-xin.gitee.io" target="_blank">lin-xin.gitee.io</el-link> -->
                    </div>
                    <div class="info-desc">{{ user.description }}</div>
                    <!-- <div class="info-icon">
                        <a href="https://github.com/lin-xin" target="_blank"> <i class="el-icon-lx-github-fill"></i></a>
                        <i class="el-icon-lx-qq-fill"></i>
                        <i class="el-icon-lx-facebook-fill"></i>
                        <i class="el-icon-lx-twitter-fill"></i>
                    </div> -->
                </div>
                <!-- <div class="user-footer">
                    <div class="user-footer-item">
                        <el-statistic title="Follower" :value="1800" />
                    </div>
                    <div class="user-footer-item">
                        <el-statistic title="Following" :value="666" />
                    </div>
                    <div class="user-footer-item">
                        <el-statistic title="Total Post" :value="888" />
                    </div>
                </div> -->
            </el-card>
            <el-card class="user-content" shadow="hover"
                :body-style="{ padding: '20px 50px', height: '100%', boxSizing: 'border-box' }">
                <el-tabs tab-position="left" v-model="activeName">
                    <!-- <el-tab-pane name="label1" label="消息通知" class="user-tabpane">
                        <TabsComp />
                    </el-tab-pane> -->
                    <el-tab-pane name="label2" label="我的头像" class="user-tabpane">
                        <div class="crop-wrap" v-if="activeName === 'label2'">
                            <vueCropper ref="cropper" :img="imgSrc" :autoCrop="true" :centerBox="true" :full="true"
                                mode="contain" :fixed="true" :fixedNumber="[1, 1]">
                            </vueCropper>
                        </div>
                        <el-button class="crop-demo-btn" type="primary">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
                        </el-button>
                        <el-button type="success" @click="saveAvatar">上传并保存</el-button>
                    </el-tab-pane>
                    <el-tab-pane name="label3" label="修改密码" class="user-tabpane">
                        <el-form :model="paramPass" class="w500" label-position="top" :rules="rules">
                            <el-form-item label="旧密码：" prop="oldPasswd">
                                <el-input type="password" v-model="paramPass.oldPasswd"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码：" prop="newPasswd">
                                <el-input type="password" v-model="paramPass.newPasswd"></el-input>
                            </el-form-item>
                            <el-form-item label="确认新密码：" prop="checkPass">
                                <el-input type="password" v-model="paramPass.checkPass"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <!-- <el-tab-pane name="label4" label="赞赏作者" class="user-tabpane">
                        <div class="plugins-tips">
                            如果该框架
                            <el-link href="https://github.com/lin-xin/vue-manage-system"
                                target="_blank">vue-manage-system</el-link>
                            对你有帮助，那就请作者喝杯饮料吧！<el-icon>
                                <ColdDrink />
                            </el-icon>
                            加微信号 linxin_20 探讨问题。
                        </div>
                        <div>
                            <img src="https://lin-xin.gitee.io/images/weixin.jpg" />
                        </div>
                    </el-tab-pane> -->
                    <el-tab-pane name="basicInfo" label="修改基本信息" class="user-tabpane">
                        <el-form :model="updateuser" label-width="100px">
                            <el-form-item label="昵称">
                                <el-input v-model="updateuser.name" placeholder="请输入昵称" maxlength="10"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <el-input v-model="updateuser.email" placeholder="请输入邮箱" maxlength="100"></el-input>
                            </el-form-item>
                            <el-form-item label="电话号码">
                                <el-input v-model="updateuser.phone" placeholder="请输入电话号码" maxlength="20"></el-input>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input v-model="updateuser.description" placeholder="请输入描述" maxlength="255" :rows="4"
                                    type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="saveBasicInfo">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts" name="ucenter">
import { useRouter } from 'vue-router';
import { reactive, ref, onMounted } from 'vue';
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css';
import avatar from '@/assets/img/img2.jpg';
import TabsComp from '../element/tabs.vue';
import { ElMessage, type FormRules } from 'element-plus';
import { UserModel } from '@/types/user';
import { GetUserInfo, UpdateUser, UpdatePasswd, UpdateAvatar } from '@/api/user'
import { Logout } from '@/api/index'
import { useUserStore } from '@/store/UserStore';
const userStore = useUserStore();

onMounted(async () => {
    await fetchData();
    avatarImg.value = user.avatar;
    imgSrc.value = user.avatar;
});


const router = useRouter();
const user = reactive<UserModel>({
    id: null,
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    description: '',
    status: ''
    // create_time: '',
    // update_time: ''
});

const updateuser = reactive({
    name: '',
    email: '',
    phone: '',
    description: '',
});

//刷新数据
const fetchData = async () => {
    const { code, message, data } = (await GetUserInfo()).data;
    if (code === 200) {
        Object.assign(user, data);
    } else {
        ElMessage.error(message)
    }
    userStore.addUser(user);
    {
        updateuser.name = user.name;
        updateuser.email = user.email;
        updateuser.phone = user.phone;
        updateuser.description = user.description;
    }
}

//修改基本信息
const saveBasicInfo = async () => {
    const { code, message, data } = (await UpdateUser(updateuser)).data
    if (code === 200) {
        await fetchData();

        ElMessage.success("保存成功")
    } else {
        ElMessage.error(message)
    }
}



//const name = localStorage.getItem('vuems_name');
const name = user.phone;
const paramPass = reactive({
    oldPasswd: '',
    newPasswd: '',
    checkPass: ''
});


//密码框规则
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
    if (value !== paramPass.newPasswd) {
        callback(new Error("两次输入不一致!"))
    } else {
        callback()
    }
}
const rules: FormRules = {

    newPasswd: [{ required: true, trigger: 'blur', message: '请输入新密码' }, {
        min: 8,
        max: 18,
        message: '密码长度位8-18个字符',
        trigger: 'blur'
    },],
    oldPasswd: [{ required: true, trigger: 'blur', message: '请输入旧密码' }, {
        min: 8,
        max: 18,
        message: '密码长度位8-18个字符',
        trigger: 'blur'
    },],

    checkPass: [{ required: true, trigger: 'blur', message: '请再次输入密码' }, { validator: validateConfirmPassword, trigger: 'blur' }],
};
//修改密码
const onSubmit = async () => {
    const { code, message, data } = (await UpdatePasswd(paramPass)).data

    if (code === 200) {
        await Logout();
        ElMessage.success("修改成功")
        router.push('/login');
    } else {
        ElMessage.error(message)
    }
};

const activeName = ref('label1');

const avatarImg = ref(user.avatar);
const imgSrc = ref(user.avatar);


const cropImg = ref('');
const cropper: any = ref();

const setImage = (e: any) => {
    const file = e.target.files[0];
    if (!file.type.includes('image/')) {
        return;
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
        imgSrc.value = event.target.result;
        cropper.value && cropper.value.replace(event.target.result);
    };
    reader.readAsDataURL(file);
};


const saveAvatar = async () => {
    if (cropper.value && cropper.value.getCropData) {
        cropper.value.getCropData(async (data) => {
            const { code, message, _ } = (await UpdateAvatar(data)).data;

            if (code === 200) {
                ElMessage.success("修改成功");
                fetchData();
            } else {
                ElMessage.error(message);
            }
        });
    } else {
        console.error('cropper instance not ready or getCropData not available');
    }
    // cropImage();
    // avatarImg.value = cropImg.value;
    // console.error(avatarImg.value);
    // const { code, message, data } = (await UpdateAvatar(avatarImg.value)).data;

    // if (code === 200) {
    //     await Logout();
    //     ElMessage.success("修改成功");
    //     fetchData();
    // } else {
    //     ElMessage.error(message);
    // }
};
</script>

<style scoped>
.user-container {
    display: flex;
}

.user-profile {
    position: relative;
}

.user-profile-bg {
    width: 100%;
    height: 200px;
    background-image: url('../../assets/img/ucenter-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.user-profile {
    width: 500px;
    margin-right: 20px;
    flex: 0 0 auto;
    align-self: flex-start;
}

.user-avatar-wrap {
    position: absolute;
    top: 135px;
    width: 100%;
    text-align: center;
}

.user-avatar {
    border: 5px solid #fff;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 7px 12px 0 rgba(62, 57, 107, 0.16);

    /* 文字样式 */
    font-size: 26px;
    font-weight: bold;
    text-transform: uppercase; /* 将文字转为大写 */
    background-color: #409EFF; /* 默认的背景颜色，可以根据需要调整 */
}

.user-info {
    text-align: center;
    padding: 80px 0 30px;
}

.info-name {
    margin: 0 0 20px;
    font-size: 22px;
    font-weight: 500;
    color: #373a3c;
}

.info-desc {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
}

.info-desc,
.info-desc a {
    font-size: 18px;
    color: #55595c;
}

.info-icon {
    margin-top: 10px;
}

.info-icon i {
    font-size: 30px;
    margin: 0 10px;
    color: #343434;
}

.user-content {
    flex: 1;
}

.user-tabpane {
    padding: 10px 20px;
}

.crop-wrap {
    width: 600px;
    height: 350px;
    margin-bottom: 20px;
}

.crop-demo-btn {
    position: relative;
}

.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}

.w500 {
    width: 500px;
}

.user-footer {
    display: flex;
    border-top: 1px solid rgba(83, 70, 134, 0.1);
}

.user-footer-item {
    padding: 20px 0;
    width: 33.3333333333%;
    text-align: center;
}

.user-footer>div+div {
    border-left: 1px solid rgba(83, 70, 134, 0.1);
}
</style>

<style>
.el-tabs.el-tabs--left {
    height: 100%;
}
</style>
