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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLobbyDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLobbyDto {
    hostPlayerId;
    lobbyName;
    gameMode;
    maxPlayers;
    isPrivate;
}
exports.CreateLobbyDto = CreateLobbyDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLobbyDto.prototype, "hostPlayerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 40),
    __metadata("design:type", String)
], CreateLobbyDto.prototype, "lobbyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['CLASSIC', 'RANKED', 'ARCADE', 'CUSTOM']),
    __metadata("design:type", String)
], CreateLobbyDto.prototype, "gameMode", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateLobbyDto.prototype, "maxPlayers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLobbyDto.prototype, "isPrivate", void 0);
//# sourceMappingURL=create-lobby.dto.js.map