"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyController = void 0;
const common_1 = require("@nestjs/common");
const create_lobby_dto_1 = require("./dto/create-lobby.dto");
const player_action_dto_1 = require("./dto/player-action.dto");
const ready_dto_1 = require("./dto/ready.dto");
const lobby_service_1 = require("./lobby.service");
let LobbyController = class LobbyController {
    lobbyService;
    constructor(lobbyService) {
        this.lobbyService = lobbyService;
    }
    create(dto) {
        return this.lobbyService.create(dto);
    }
    findAll() {
        return this.lobbyService.findAll();
    }
    findById(id) {
        return this.lobbyService.findById(id);
    }
    findByCode(code) {
        return this.lobbyService.findByCode(code);
    }
    findMembers(id) {
        return this.lobbyService.findMembers(id);
    }
    join(id, dto) {
        return this.lobbyService.join(id, dto.playerId);
    }
    leave(id, dto) {
        return this.lobbyService.leave(id, dto.playerId);
    }
    setReady(id, dto) {
        return this.lobbyService.setReady(id, dto.playerId, dto.isReady);
    }
    startGame(id, dto) {
        return this.lobbyService.startGame(id, dto.playerId);
    }
};
exports.LobbyController = LobbyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lobby_dto_1.CreateLobbyDto]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('code/:lobbyCode'),
    __param(0, (0, common_1.Param)('lobbyCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "findMembers", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, player_action_dto_1.PlayerActionDto]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "join", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, player_action_dto_1.PlayerActionDto]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "leave", null);
__decorate([
    (0, common_1.Post)(':id/ready'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ready_dto_1.ReadyDto]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "setReady", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, player_action_dto_1.PlayerActionDto]),
    __metadata("design:returntype", void 0)
], LobbyController.prototype, "startGame", null);
exports.LobbyController = LobbyController = __decorate([
    (0, common_1.Controller)('lobbies'),
    __metadata("design:paramtypes", [lobby_service_1.LobbyService])
], LobbyController);
//# sourceMappingURL=lobby.controller.js.map