#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;

    // texture(color_grading_lut_texture_sampler, uv)
    highp float bLevel = floor(color.b * _COLORS);
    highp vec2 uv1 = vec2(color.r / _COLORS + bLevel / _COLORS, color.g);
    highp vec3 color1 = texture(color_grading_lut_texture_sampler, uv1).rgb;
    if (bLevel < _COLORS) {
        highp vec2 uv2 = vec2(color.r / _COLORS + (bLevel + 1.0) / _COLORS, color.g);
        highp vec3 color2 = texture(color_grading_lut_texture_sampler, uv2).rgb;
        color1 = mix(color1, color2, color.b * _COLORS - bLevel);
    }

    out_color = vec4(color1, color.a);
}
