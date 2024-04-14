
function fft(points)
{
    var points_real = [];
    var points_imag = [];

    points.forEach((v, i) => {
        if(i % 2 == 0)
        {
            points_real.push(v);
        }
        else
        {
            points_imag.push(v);
        }
    });

    // for(var i = 0; i < 256; i++)
    // {
    //     points_real[i] = Math.cos(32 * 2*Math.PI * i / 256.);
    //     points_imag[i] = 0;
    // }

    var points_complex = {real: points_real, imag: points_imag};

    _fft(points_complex, 0, 1);

    return points_complex;
}

function _fft(points, begin, stride )
{

    const N = points.real.length / stride;

    // console.log(N);
    if(N == 1)
    {
        return;
    }
    else
    {
        _fft(points, begin, stride * 2);
        _fft(points, begin + stride, stride * 2);

        const factor = getFactor(N);

        var new_var_real = [];
        var new_var_imag = [];
        var j = 0;
        for(var i = begin; i < points.real.length; i += 2 * stride)
        {
            const v_even_real = points.real[i];
            const v_odd_real = points.real[i + stride];

            const v_even_imag = points.imag[i];
            const v_odd_imag = points.imag[i + stride];

            // new_var[j] = v_even + factor[j]*v_odd;
            var fact_v_odd = mulComplex(factor.real[j], factor.imag[j], v_odd_real, v_odd_imag);
            new_var_real[j] = v_even_real + fact_v_odd.real;
            new_var_imag[j] = v_even_imag + fact_v_odd.imag;

            // new_var[j + N / 2] = v_even + factor[j + N/2]*v_odd;
            fact_v_odd = mulComplex(factor.real[j+N/2], factor.imag[j+N/2], v_odd_real, v_odd_imag);
            new_var_real[j+N/2] = v_even_real + fact_v_odd.real;
            new_var_imag[j+N/2] = v_even_imag + fact_v_odd.imag;

            j += 1;
        }
        // console.log("here", new_var_imag.length);
        for(var i = 0; i < new_var_real.length; i++)
        {
            points.real[begin + i*stride] = new_var_real[i];
            points.imag[begin + i*stride] = new_var_imag[i];
        }

        // new_var_real.forEach((v, i) => {
        //     points.real[begin + i*stride] = v;
        // });
        
        // new_var_imag.forEach((v, i) => {
        //     points.imag[begin + i*stride] = v;
        // });

    }
}

function getFactor(len)
{
    var fact_real = [];
    var fact_imag = [];

    for(var i = 0; i < len; i++ )
    {

        fact_real.push(Math.cos(2 * Math.PI * i / len));
        fact_imag.push(-Math.sin(2 * Math.PI * i / len));

    }
    return {
            real: fact_real,
            imag: fact_imag
        };
}

function mulComplex(x_real, x_imag, y_real, y_imag)
{

    return { 
            real: x_real*y_real - x_imag*y_imag,
            imag: x_real*y_imag + x_imag*y_real
        };

}

function sumFT(ft, t, n_terms)
{

    const N = ft.real.length;
    var pos = [];

    var sum_real = ft.real[0] / N;
    var sum_imag = ft.imag[0] / N;
    pos.push({real: sum_real, imag: sum_imag});
    for(var i = 1; i < n_terms; i++)
    {
        var coef_real = ft.real[i] / N;
        var coef_imag = ft.imag[i] / N;
        var x = mulComplex(coef_real, coef_imag, Math.cos(i*2*Math.PI*t), Math.sin(i*2*Math.PI*t));
        sum_real += x.real; sum_imag += x.imag;
        pos.push( {real: sum_real, imag: sum_imag} );

        coef_real = ft.real[N - i] / N;
        coef_imag = ft.imag[N - i] / N;
        x = mulComplex(coef_real, coef_imag, Math.cos(-i*2*Math.PI*t), Math.sin(-i*2*Math.PI*t));
        sum_real += x.real; sum_imag += x.imag;
        pos.push( {real: sum_real, imag: sum_imag} );
    }
    return pos;
}

export {fft};
export {sumFT};