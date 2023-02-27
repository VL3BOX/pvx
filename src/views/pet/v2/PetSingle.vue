<template>
    <div class="v-pet-single" v-if="pet" v-loading="loading">
        <div class="m-pet-navigation">
            <el-button class="u-goback" size="medium" @click="goBack" plain>返回列表</el-button>
        </div>
        <div class="m-pet-content flex">
            <div class="m-pet-links">
                <a class="u-link u-item" :href="getLink('item', item_id)" target="_blank"
                    ><i class="el-icon-collection-tag"></i>物品信息</a
                >
                <template v-if="achievement_id">
                    <em> | </em>
                    <a class="u-link u-achievement" :href="getLink('cj', achievement_id)" target="_blank"
                        ><i class="el-icon-trophy"></i>成就信息</a
                    >
                </template>
            </div>
            <petCard :petObject="pet" :lucky="luckyList"></petCard>
            <div class="m-pet-info">
                <div class="u-title">{{ pet.Name }}</div>
                <div class="u-stars">
                    <i class="el-icon-star-on" v-for="count in pet.Star" :key="count"></i>
                </div>
                <!-- <h1 class="u-title">
                    <span class="u-name">{{ pet.Name }}</span>
                    <span class="u-type">{{ getPetType(pet.Class) }} · {{ getPetSource(pet.Source) }}</span>
                    <i class="u-stars">
                        <i class="el-icon-star-on" v-for="count in pet.Star" :key="count"></i>
                    </i>
                </h1> -->
                <div class="u-metas">
                    <div class="u-meta u-number"><span class="u-meta-label">编号：</span>{{ pet.Index }}</div>
                    <div class="u-meta u-type"><span class="u-meta-label">分类：</span>{{ getPetType(pet.Class) }}</div>
                    <div class="u-meta u-score"><span class="u-meta-label">分数：</span>{{ pet.Score }}</div>
                    <div class="u-meta u-get-way">
                        <span class="u-meta-label">获取方式：</span>{{ getPetSource(pet.Source) }}
                    </div>
                    <div class="u-meta u-source">
                        <span class="u-meta-label">获取线索：</span>
                        <template v-for="item in getPetDesc(pet.OutputDes)">
                            <span :key="item.text">{{ cleanResourceText(item.text) }}</span>
                        </template>
                    </div>
                    <div class="u-meta u-desc">
                        <span class="u-meta-label">宠物说明：</span>
                        <span class="u-meta-value">
                            <template v-for="(item, index) in getPetDesc(pet.Desc)">
                                <span :key="index" v-html="item.text"></span>
                            </template>
                        </span>
                    </div>

                    <div class="u-meta u-shop" v-if="shopInfo.RewardsPrice || shopInfo.CoinPrice">
                        <span class="u-meta-label">商城价格：</span>
                        <span class="u-price">
                            <el-tag class="u-price-item u-rewards" v-if="shopInfo.RewardsPrice > 0"
                                >积分<b>{{ shopInfo.RewardsPrice }}</b
                                ><i class="u-icon-rewards"></i
                            ></el-tag>
                            <el-tag class="u-price-item u-coin"
                                >通宝<b>{{ shopInfo.CoinPrice }}</b
                                ><i class="u-icon-coin"></i
                            ></el-tag>
                        </span>
                    </div>
                    <!-- <div class="u-meta u-lucky-dates" v-if="luckyDateList.length != 0">
                        <span class="u-meta-label">福缘日期：</span>
                        <a class="u-meta u-link u-lucky-dates" @click="luckyDateShow = true">
                            <i class="el-icon-date"></i>点击查看
                        </a>
                    </div> -->
                </div>
                <!-- 宠物技能 -->
                <div class="u-pet-skill-title">宠物招式</div>
                <div class="m-pet-skills">
                    <div class="u-skill" v-for="(skill, index) in petSkills" :key="index">
                        <el-popover trigger="hover" popper-class="m-pet-skill" :visible-arrow="false" placement="top">
                            <div class="u-skill-pop">
                                <div class="u-skill-name">{{ skill.Name }}</div>
                                <div class="u-skill-desc">{{ skill.Desc }}</div>
                            </div>
                            <img
                                slot="reference"
                                class="u-skill-icon"
                                :src="iconLink(skill.IconID)"
                                :alt="skill.Name"
                            />
                        </el-popover>
                    </div>
                </div>
            </div>
        </div>
        <!-- 宠物羁绊 -->
        <div class="m-pet-fetters" v-if="medalList && medalList.length">
            <div class="u-header">
                <img class="u-icon" svg-inline src="../../../assets/img/achievement.svg" />
                <span class="u-txt">宠物羁绊</span>
            </div>
            <!-- 羁绊信息 -->
            <petFetters :info="item" v-for="item in medalList" :key="item.ID" />
        </div>
        <!-- 宠物地图 -->
        <!-- <div class="u-map-title">捕获地图/获取攻略</div> -->
        <div class="m-pet-map" v-show="mapDisplay">
            <div class="u-header">
                <img class="u-icon" svg-inline src="../../../assets/img/achievement.svg" />
                <span class="u-txt">捕获地图</span>
            </div>
            <!-- 地图组件 -->
            <pet-map :petId="parseInt(id)" @loaded="mapLoaded" />
        </div>
        <!-- 宠物攻略 -->
        <div class="m-pet-wiki">
            <Wiki
                source_type="item"
                :source_id="item_id"
                :type="type"
                :id="id"
                title="获取攻略"
                :source_title="title"
            ></Wiki>
        </div>
        <div class="m-pet-comment">
            <Comment :id="id" :category="type" order="desc" />
        </div>
        <el-dialog class="m-lucky-dates-dialog" title="福缘日期" :visible.sync="luckyDateShow" width="50%">
            <div class="u-lucky-dates-description">
                <el-icon class="el-icon-info" name="el-icon-info"></el-icon>
                红色显示为当日福缘，蓝色显示为距离今日最近的福缘日期
            </div>
            <!-- 颜色（type）：优先今日（红色danger），距离今日最近的（蓝色默认），其他（灰色info）-->
            <el-tag
                class="u-lucky-dates-item"
                v-for="(item, index) in luckyDateList"
                :key="index"
                :type="item.isToday ? 'danger' : item.isClosest ? '' : 'info'"
            >
                {{ item.month }} 月 {{ item.day }} 日
            </el-tag>
        </el-dialog>
    </div>
</template>

<script>
import { getPet, getPets, getShopInfo, getPetSkill, getSkill } from "@/service/pet";
import { getPetLucky, getPetLuckyReverse } from "@/service/pet";
import petCard from "@/components/pet/v2/PetCard.vue";
import petFetters from "@/components/pet/PetFetters.vue";
import Wiki from "@/components/wiki/Wiki.vue";
import petType from "@/assets/data/pet_type.json";
import petSource from "@/assets/data/pet_source.json";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import { postStat } from "@jx3box/jx3box-common/js/stat.js";
import dayjs from "dayjs";
import PetMap from "@/components/pet/v2/PetMap.vue";

export default {
    name: "PetSingle",
    props: [],
    components: {
        petCard,
        petFetters,
        Wiki,
        Comment,
        PetMap,
    },
    data: function () {
        return {
            type: "pet",
            pet: "",
            petSkills: [],
            shopInfo: "",
            luckyList: [],
            luckyDateList: [],
            luckyDateShow: false,
            medalList: [],
            mapDisplay: false,
            loading: false,
            search: "",
        };
    },
    computed: {
        id: function () {
            return this.$route.params.id;
        },
        item_id: function () {
            return this.pet?.ItemTabType + "_" + this.pet?.ItemTabIndex;
        },
        achievement_id: function () {
            return this.petWiki?.achievement_id;
        },
        client: function () {
            return this.$store.state.client;
        },
        title: function () {
            return this.pet?.Name;
        },
        params: function () {
            return {
                client: this.client,
            };
        },
    },
    watch: {
        id() {
            this.getPetInfo();
        },
    },
    methods: {
        // 获取宠物详情
        getPetInfo: function () {
            this.loading = true;
            getPet(this.id, this.params)
                .then((res) => {
                    this.pet = res.data;
                    this.medalList = res.data.medal_list;
                    this.loadPetSkills(res.data.__skills);
                    this.getShopInfo();
                    this.getPetMedal();
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
                });
        },
        // 获取宠物技能信息
        loadPetSkills: function (data) {
            const levelIds = [];
            const skillIds = [];

            this.petSkills = [];

            for (const key in data) {
                // 技能等级
                if (key.startsWith("Level") && data[key]) {
                    levelIds.push(data[key]);
                }
                // 技能id
                if (key.startsWith("SkillID") && data[key]) {
                    skillIds.push(data[key]);
                }
            }

            getSkill({
                ids: skillIds.join(","),
                client: this.client,
            }).then((skillRes) => {
                levelIds.forEach((level, index) => {
                    let skills = skillRes.data.filter((skill) => skill.Level === level);

                    const skill = skills.find((_skill) => _skill.SkillID === skillIds[index]);

                    if (skill) {
                        this.petSkills.push(skill);
                    }
                });
            });
        },
        // 获取宠物商城价格
        getShopInfo() {
            const params = {
                item_type: this.pet.ItemTabType,
                item_id: this.pet.ItemTabIndex,
            };
            getShopInfo(params).then((res) => {
                this.shopInfo = res?.data || "";
            });
        },
        // 获取宠物种类
        getPetType: function (typeId) {
            const _petType = petType.find((item) => item.class === typeId);
            return _petType?.name || "";
        },
        // 获取宠物途径
        getPetSource: function (sourceId) {
            const _petSource = petSource.find((item) => ~~sourceId === ~~item.source);
            return _petSource?.name || "";
        },
        // 获取宠物描述
        getPetDesc: function (str) {
            const regex = /<text>text=(.*?)font=(\d+).*?<\/text>/gimsy;
            let matches = [];
            let match;
            while ((match = regex.exec(str))) {
                matches.push(match);
            }

            // 格式化分段
            let result = [];
            for (let group of matches) {
                result.push({
                    font: ~~group[2],
                    text: group[1].slice(1, -2).replace(/[\\n]/g, ""),
                });
            }
            return result;
        },
        goBack() {
            this.$router.push({ name: "list" });
        },
        goItem() {
            const { ItemTabType, ItemTabIndex } = this.pet;
            const link = getLink("item", `${ItemTabType}_${ItemTabIndex}`);

            window.open(link, "_blank");
        },
        // 获取福缘宠物id
        getPetLucky: function () {
            getPetLucky().then((res) => {
                let data = res.data.std;
                let dateIndex = dayjs(new Date()).format("MDD");
                this.luckyList = data[dateIndex];
            });
        },
        // 通过宠物ID获取所有福缘日期
        getPetLuckyReverse: function (petID) {
            getPetLuckyReverse().then((res) => {
                const now = new Date();
                let data = {}; // key 是 距离今天的天数, value 是 object，用于取最近
                let currentPetLucky = res.data.std[petID];
                if (currentPetLucky) {
                    currentPetLucky.forEach((item) => {
                        let month = parseInt(item.slice(0, -2));
                        let day = parseInt(item.slice(-2));
                        let obj = {
                            month: month,
                            day: day,
                            isToday: month == now.getMonth() + 1 && day == now.getDate(),
                            isClosest: false,
                        };

                        let itemDate = new Date();
                        itemDate.setMonth(month - 1, day);
                        let diff = Math.ceil((itemDate - now) / (1000 * 3600 * 24));
                        if (diff < 0) diff += 365; // 已过了的加一年
                        data[diff] = obj; // 算距离今天的天数
                    });
                    data[Math.min(...Object.keys(data))].isClosest = true; // 标记最近的那个
                    this.luckyDateList = Object.values(data).sort(
                        (lhs, rhs) => lhs.month - rhs.month || lhs.day - rhs.day
                    ); // 按月日排序
                }
            });
        },
        getLink,
        // 获取宠物羁绊的宠物
        getPetMedal() {
            const ids = new Set();
            // 将每个羁绊的宠物id取出来
            this.medalList.forEach((item) => {
                item.pets = [];
                for (const key in item) {
                    if (key.includes("PetIndex") && item[key]) {
                        item.pets = [...item.pets, item[key]];
                        ids.add(item[key]);
                    }
                }
            });
            getPets({ ids: [...ids].join(","), client: this.client }).then((res) => {
                const list = res.data.list;
                // 将羁绊的宠物放入对应的羁绊中
                this.medalList.map((item) => {
                    const petList = list.filter((pet) => item.pets.includes(pet.Index));
                    this.$set(item, "petList", petList);
                    return item;
                });
            });
        },
        mapLoaded(visible) {
            this.mapDisplay = visible;
        },
        goSearch() {
            this.$router.push({ name: "list", params: { search: this.search } });
        },
        iconLink,
        cleanResourceText: function (str) {
            return str && str.startsWith("获取线索：") ? str.replace("获取线索：", "") : str;
        },
    },
    created: function () {
        this.getPetLucky();
        this.getPetLuckyReverse(this.id);
    },
    mounted: function () {
        this.getPetInfo();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pet/v2/single.less";
@import "~@/assets/css/pet/v2/map.less";
</style>
