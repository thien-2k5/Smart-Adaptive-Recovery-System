package com.viettelpost.sars.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.viettelpost.sars.dto.response.*;
import com.viettelpost.sars.service.*;

@RestController
@RequestMapping("/api/recoverys")
@RequiredArgsConstructor
public class RecoveryController {
    
    @GetMapping("/{caseId}")
    public ApiResponse<RecoveryCaseDto> getCase(@PathVariable String caseId) { return null; }
    
}
