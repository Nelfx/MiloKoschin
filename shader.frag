precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_noiseTex;

float sdBlobbyCross(vec2 pos, float he) {
    pos = abs(pos);
    pos = vec2(abs(pos.x-pos.y),1.0-pos.x-pos.y)/sqrt(2.0);

    float p = (he-pos.y-0.25/he)/(6.0*he);
    float q = pos.x/(he*he*16.0);
    float h = q*q - p*p*p;
    
    float x;
    if( h>0.0 ) { float r = sqrt(h); x = pow(q+r,1.0/3.0)-pow(abs(q-r),1.0/3.0)*sign(r-q); }
    else        { float r = sqrt(p); x = 2.0*r*cos(acos(q/(p*r))/3.0); }
    x = min(x,sqrt(2.0)/2.0);
    
    vec2 z = vec2(x,he*(1.0-2.0*x*x)) - pos;
    return length(z) * sign(z.y);
}


float calc(vec2 uv, vec2 uv0) {
	float d = sdBlobbyCross(uv, sin(u_time * 0.2));
	d = sin(d * 6.0 + u_time * 0.2);
	d = abs(d);
	d = 0.05 / d;
	//d = 1.0 - d;
	//d = step(d, 0.1);		
	d = pow(d, 2.0);
	return d;
}

void  main() {
	float t = u_time * 0.2;
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	uv -= 0.5;
	uv.x *= u_resolution.x / u_resolution.y;
	vec2 uv0 = uv;

	vec3 finalCol = vec3(0.071);

	uv *= 4.0;
	uv -= uv0 * 2.0	;
	for (float i = 0.0; i < 3.0; i++) {
		float r = calc(uv, uv0);
		float n = 0.03;
		float g = calc(uv + uv * n, uv0);
		float b = calc(uv + uv * n * 2.0, uv0);

		finalCol += vec3(r,g,b);

		float ro = atan(uv.y, uv.x) + t;
		uv = vec2(cos(i*(3.141592/4.0) + ro), sin(i*(3.141592/4.0) + ro)) * length(uv);
	}


	gl_FragColor = vec4(finalCol, 1.0);
}