function checkData(x, y, r) {
        let resp = {
            isValid: true,
            reason: "Корректные данные"
        }

        if (isNaN(+x) || isNaN(+y) || isNaN(+r)) {
            resp.isValid = false;
            resp.reason = "Невалидные данные!"
        }

        if (!y) {
            resp.isValid = false;
            resp.reason = "Невалидные данные!"
        }

        if (+y < -3) {
            resp.isValid = false;
            resp.reason = "y должен быть больше или равен -3 (y=" + +y + ")";
        }
        if (+y > 3) {
            resp.isValid = false;
            resp.reason = "y должен быть меньше или равен 3 (y=" + +y + ")";
        }

        return resp;
}

export default checkData