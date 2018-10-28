/**
 * NHL Wheel of Justice Using HTML5 Canvas
 * Based on Creating a Roulette Wheel Using HTML5 Canvas
 * http://www.switchonthecode.com/tutorials/creating-a-roulette-wheel-using-html5-canvas
 */

var _playoffs = false;
var _isPronger = false;
var arrPlayers = [];

function wheel() {
    var p1 = $('#player1'),
        p2 = $('#player2'),
        result = $('#result'),
        mobile = false,
        self = this;
    
    var _numSlices = _options.length;
    var _startAngle = 0;
    var _arc = (_numSlices > 0) ? Math.PI / (_numSlices / 2) : Math.PI;
    var _spinTimeout = null;
    var _spinTime = 0;
    var _spinTimeTotal = 0;
    var _spinAngleStart = 0;


    this.init = function()
    {
        this.mobile = ($('body').hasClass('mobile'));
        this.setAutoComplete();
        this.setOnClicks();
        this.drawRouletteWheel();

        // Playoff Mode
        if (!this.mobile) {
            $("input:checkbox:checked").attr("checked", "");
            $('#playoff_mode').iphoneStyle();
        }
        $('#playoff_mode').change(self.playoffMode);


    },

    this.setOnClicks = function() {
        $('.btnSpin').click(this.clickSpin);
        $('#btnReset').click(this.clickReset);
        $('.presets a').click(this.clickPreset);

        $("#wheelcanvas").click(this.clickSpin);

    },

    this.setAutoComplete = function() {
        var arrPlayerNames = [];

        $.each(players, function(i, val) {
            arrPlayerNames.push(i);
            arrPlayers[i] = val;
        });
        p1.autocomplete({source: arrPlayerNames, close: this.selectPlayer, open: this.openAutocomplete});
        p2.autocomplete({source: arrPlayerNames, close: this.selectPlayer, open: this.openAutocomplete});

        p1.change(this.changePlayer);
	    p2.change(this.changePlayer);
    },

    /**
     * On input change, clear data if form is empty
     */
    this.changePlayer = function(ev) {
        var t = $(this);
        if ($.trim(t.val()) == '') {
            t.data('val', 0);
            t.val('');
        }
    },

    this.openAutocomplete = function() {
        $(this).autocomplete('widget').css('z-index', 3);
        return false;
    },

    /**
     * On AutoComplete select, set player's data value from player array
     */
    this.selectPlayer = function (ev) {
        var t = $(this);
        var plr = t.val();
        if (plr) {
            t.data('val', arrPlayers[plr]);
        }
    },

    /**
     * Reset Form
     */
    this.clickReset = function(ev) {
        self.setPlayerData(p1, '', 0);
        self.setPlayerData(p2, '', 0);
        $('#action').val('headhit');
        result.val('1');
        p1.focus();
    },

    /**
     * Preset Form from list
     */
    this.clickPreset = function(ev)
    {
        var random,
            bSpin = false,
            t = $(this);

        if (!t.hasClass('external')) {
            ev.preventDefault();

            var p1d = t.data('p1'),
                p2d = t.data('p2'),
                sAction = t.data('action') ? t.data('action') : 'headhit',
                sResult = t.data('result') ? t.data('result') : '1';

            if (p1d == 'bruin') {
                random = (Math.floor(Math.random() * aBB.length)) + 1;
                self.setPlayer(p1, aBB[random]);
            } else {
                self.setPlayer(p1, p1d);
            }

            if (p2d == 'bruin') {
                random = (Math.floor(Math.random() * aBB.length)) + 1;
                self.setPlayer(p2, aBB[random]);
            } else {
                self.setPlayer(p2, p2d);
            }

            if (p1d != '' && p2d != '') {
                bSpin = true;
            }

            self.setActionResult(sAction, sResult);

            if(bSpin) {
                self.clickSpin();
            }
        }

    },

    /**
     * If using IE, show a spinner image instead of the wheel canvas.
     */
    this.displaySpinner = function(show) {
        if ($.browser.msie) {
            if (parseInt($.browser.version) < 9) {
                if (show) {
                    $('#spinner').show();
                } else {
                    $('#spinner').hide();
                }
            }
        }
    },

    this.drawRouletteWheel = function() {

        var ctx,
            width = 500,
            half,
            outsideRadius,
            textRadius,
            insideRadius,
            angle;
        var colors = ['#94CBB9', '#99B3FF', '#5C85FF', '#9276B4', '#C9666A', '#FF571F',"#FF9F5C", "#FFE699", "#FFD65C","#FFC71F"];

        var canvas = document.getElementById("wheelcanvas");
        if (isCanvasSupported(canvas))
        {
            // get canvas width
            width = canvas.width;
            half = width/2;
            outsideRadius = (0.43*width);   //215
            textRadius = (0.32*width);      //160,
            insideRadius = (0.15*width);    //75,

            ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, width, width);

            var imgCenter = document.getElementById("imgCenter");
            ctx.drawImage(imgCenter, (0.42*width), (0.4*width));
            ctx.fill();
            if (self.mobile) {
                ctx.font = "normal 11px 'Helvetica Neue', Helvetica, Arial, sans-serif";
            } else {
                ctx.font = "normal 12px 'Helvetica Neue', Helvetica, Arial, sans-serif";
            }



            var show_angled_text = self.mobile;

            for (var i = 0; i < _numSlices; i++) {
                angle = _startAngle + i * _arc;
                ctx.fillStyle = colors[i];
                ctx.beginPath();
                ctx.arc(half, half, outsideRadius, angle, angle + _arc, false);
                ctx.arc(half, half, insideRadius, angle + _arc, angle, true);
                ctx.fill();
                ctx.save();

                ctx.fillStyle = 'black';
                ctx.translate(half + Math.cos(angle + _arc / 2) * textRadius, half + Math.sin(angle + _arc / 2) * textRadius);
                if (show_angled_text) {
                    ctx.rotate(angle + _arc / 2 + Math.PI / 2);
                }
                var text = _options[i];
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                ctx.restore();
            }

            //Arrow
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.moveTo(half - 4, half - (outsideRadius + 10));
            ctx.lineTo(half + 4, half - (outsideRadius + 10));
            ctx.lineTo(half + 4, half - (outsideRadius - 5));
            ctx.lineTo(half + 9, half - (outsideRadius - 5));
            ctx.lineTo(half, half - (outsideRadius - 13));
            ctx.lineTo(half - 9, half - (outsideRadius - 5));
            ctx.lineTo(half - 4, half - (outsideRadius - 5));
            ctx.lineTo(half - 4, half - (outsideRadius + 5));
            ctx.fill();
        }
    },

    /**
     * Spin the Wheel
     */
    this.clickSpin = function(event) {
        var p1_data = p1.data('val'),
            p2_data = p2.data('val');

        var isValid = true;
        $('.required').hide();

        if (p1_data == 0) {
            $('#req1').show();
            p1.focus();
            isValid = false;
        }
        if (p2_data == 0) {
            $('#req2').show();
            p2.focus();
            isValid = false;
        }

        if (isValid)
        {
            _isPronger = (p1.val().toLowerCase() == 'chris pronger');

            // check if players entered exist in players arr, if not reset to default values
            if(!arrPlayers[p1.val()]) {
                p1.data('val', 2);
            }
            if(!arrPlayers[p2.val()]) {
                p2.data('val', 2);
            }


            $('#resultTitle').text('NHL Operations Hearing in progress...');
            $('#resultText').text('');
            self.displaySpinner(true);

            self.updateSlices();

            _spinAngleStart = Math.random() * 10 + 10;
            _spinTime = 0;
            _spinTimeTotal = Math.random() * 3 + 4 * 2000;
            self.rotateWheel();

            if (self.mobile) {
                $.mobile.silentScroll($("#wrapper").offset().top);
            }
        }
    },

    /**
     * Lookup Options to show in Wheel based on players selected.
     */
    this.updateSlices = function () {

        var p1_d = p1.data('val'),
            p2_d = p2.data('val'),
            optionLookup, result_val, optionId;

        // set options
        optionLookup = aM[p1_d][p2_d];
        result_val = result.val();
        optionId = aR[optionLookup][result_val];

        this.setOptions(optionId);
        this.drawRouletteWheel();

    },

    /**
     * Recursive function that rotates and stops the wheel.
     */
    this.rotateWheel = function () {
        _spinTime += 30;
        // check if we should stop
        if (_spinTime >= _spinTimeTotal) {
            self.stopRotateWheel();
            return;
        }
        // change the angles
        var spinAngle = _spinAngleStart - self.easeOut(_spinTime, 0, _spinAngleStart, _spinTimeTotal);
        _startAngle += (spinAngle * Math.PI / 180);
        self.drawRouletteWheel();
        _spinTimeout = setTimeout(function(){ self.rotateWheel()}, 30);
    },

    /**
     * Stop the wheel, get the slice shown at the top of the wheel.
     */
    this.stopRotateWheel = function () {
        clearTimeout(_spinTimeout);
        var degrees = _startAngle * 180 / Math.PI + 90;
        var arcd = _arc * 180 / Math.PI;
        var index = Math.floor((360 - degrees % 360) / arcd);
        self.displayPunishment(index);
    },

    this.setPlayerData = function(plr, name, val) {
        plr.val(name);
        plr.data('val', val);
    },

    this.setPlayer = function(plr, name) {
        if (name) {
            plr.val(name);
            plr.data('val', arrPlayers[name]);
        } else {
            plr.val('');
            plr.data('val', 0);
            plr.focus();
        }
    },

    this.setOptions = function(optionId)
    {
        if (_playoffs) {
            if (_isPronger) {
                _options = [s1, s2, sHP, s1, s2, sHP, s1, s2, sHP, s1];
            } else {
                switch(optionId) {
                    case 1:
                        _options = [sHP, sF, sHP, sF, sHP, sF, sHP, sF, sHP, sF];
                        break;
                    case 2:
                        _options = [s1, sHP,s1, sHP,s1, sHP,s1, sHP,s1, sHP];
                        break;
                    case 6:
                        _options = [s1,s2,s3,s4,sHP,s1,s2,s3,s4,sHP];
                        break;
                    case 7:
                        _options = [s3,s6,s9,sS,sHP,s3,s6,s9,sS,sHP];
                        break;
                    case 8:
                        _options = [sS,sL,sS,sL,sS,sL,sS,sL,sS,sL];
                        break;
                    default:
                        _options = [s1, s2, sHP,s1, s2, sHP,s1, s2, sHP,s1];
                        break;
                }

            }

        } else {
            switch(optionId) {
                case 1:
                    _options = [sHP, sF, sHP, sF, sHP, sF, sHP, sF, sHP, sF];
                    break;
                case 2:
                    _options = [s1, sHP,s1, sHP,s1, sHP,s1, sHP,s1, sHP];
                    break;
                case 3:
                    _options = [s1, s2, sHP, s1, s2, sHP, s1, s2, sHP, s1];
                    break;
                case 5:
                    _options = [s1, s2, s4, s6, sHP,s1, s2, s4, s6, sHP];
                    break;
                case 6:
                    _options = [s3,s6,s9,sS,sHP,s3,s6,s9,sS,sHP];
                    break;
                case 7:
                    _options = [s6,s9,sS,s6,s9,sS,s6,s9,sS,sL];
                    break;
                case 8:
                    _options = [sS,sL,sS,sL,sS,sL,sS,sL,sS,sL];
                    break;
                case 4:
                default:
                    _options = [s1,s2,s3,s4,sHP,s1,s2,s3,s4,sHP];
                    break;
            }
        }

        // set g. vars
        _numSlices = _options.length;
        _arc = (_numSlices > 0) ? Math.PI / (_numSlices / 2) : Math.PI;

    },

    this.displayPunishment = function(index) {
        var p1v = p1.data('val'),
            p2v = p2.data('val'),
            p1_form_val = p1.val(),
            p2_form_val = p2.val(),
            txtPunishment,
            txtPunishmentDesc = '';

        txtPunishment = _options[index];
        $('#resultTitle').text(txtPunishment);

        self.displaySpinner(false);

        switch(txtPunishment) {
            case sHP:
                txtPunishmentDesc = sHP_r;
                break;
            case sF:
                txtPunishmentDesc = sF_r;
                break;
            case sS:
                txtPunishmentDesc = sS_r;
                break;
            case sL:
                txtPunishmentDesc = sL_r;
                break;
            default:
                txtPunishmentDesc = sG_r;
                txtPunishmentDesc = txtPunishmentDesc.replace(/!game/g, txtPunishment.toLowerCase());
                break;
        }

        txtPunishmentDesc = txtPunishmentDesc.replace(/!p1/g, p1_form_val);
        txtPunishmentDesc = txtPunishmentDesc.replace(/!p2/g, p2_form_val);

        if (_playoffs) {
            if (txtPunishment === sHP || txtPunishment === sF) {
                txtPunishmentDesc += " In reviewing this play, we also took into consideration that it's the playoffs. We did think about it though. We were very close. Like really close.";
            } else {
                txtPunishmentDesc += " In reviewing this play, we also took into consideration that it's the playoffs and this should be enough.";
            }
        } else {

            var sType, sAdd, bAdd = false;

            switch(p2v) {
                case 5:
                    txtPunishmentDesc += self.addResultText(sP1_r, p2_form_val, "is Colin Campbell's son");
                    bAdd = true;
                    break;
            }

            // Bruins check
            if (($.inArray(p1_form_val, aBB)) != -1) {
                p1v = 'bruin';
            }

            if (!bAdd)
            {
                switch(p1v) {
                    case 1:
                        txtPunishmentDesc += self.addResultText(sP1_r, p1_form_val, 'is a superstar');
                        break;
                    case 3:
                        txtPunishmentDesc += self.addResultText(sP1_r, p1_form_val, 'is a goon');
                        break;
                    case 5:
                        txtPunishmentDesc += self.addResultText(sP1_r, p1_form_val, "is Colin Campbell's son");
                        break;
                    case 6:
                        txtPunishmentDesc += self.addResultText(sP1_r, p1_form_val, "has rarely ever been suspended");
                        break;
                    case 8:
                        txtPunishmentDesc += self.addResultText(sP1_r, p1_form_val, "previously almost killed Steve Moore");
                        break;
                    case 'bruin':
                        txtPunishmentDesc += self.addResultText(sP1_r, p1_form_val, "plays for the Boston Bruins, who are mostly un-suspendable");
                        break;
                }
            }
        }

        $('#resultText').text(txtPunishmentDesc);

    },

    /**
     * Used by preset function to populate the form
     */
    this.setActionResult = function(action, res) {
        if (action) {
            $('#action').val(action);
        }
        if (res) {
            result.val(res);
        }
    },

    /**
     * Populate !p and !type strings using the results.
     */
    this.addResultText = function(text, name, type) {

        var sRet = text;
        sRet = sRet.replace(/!p/g, name);
        sRet = sRet.replace(/!type/g, type);

        return sRet;

    },

    this.easeOut = function(t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    },

    this.playoffMode = function(e) {
        _playoffs = $(this).is(':checked');
        var divMode = $('.weber_mode');
        var imgMode = $('#imgWeber');
        if (_playoffs) {
            divMode.show();
            imgMode.show();
            imgMode.jrumble({
                rumbleEvent: 'constant',
                rumbleSpeed: 25,
                rangeX: 2,
                rangeY: 2,
                rangeRot: 1
            });

            setTimeout(function() {
                imgMode.hide();

            }, 3000);

        } else {
            divMode.hide();
            imgMode.hide();
        }

    }

}

function isCanvasSupported(objCanvas){
  //var elem = document.createElement('canvas');
  return !!(objCanvas.getContext && objCanvas.getContext('2d'));
}